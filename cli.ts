import chalk, {Chalk} from 'chalk';
import * as fs from 'fs';

import {TermTransitionModel} from './term-transition-model';
import {TextGenerator} from './text-generator';
import {TextParser} from './text-parser';

import minimist = require('minimist');
import * as process from 'process';

const generator = new TextGenerator();
const parser = new TextParser();

const argv = minimist(process.argv.slice(2));
const sentencesToGenerate = argv.sentences || 10;
const sourceFileNames = argv._;
const depth = argv.depth ? parseInt(argv.depth) : 2;
const minRunLength = argv.minrun ? parseInt(argv.minrun) : 3;
const endRunLength = argv.endrun ? parseInt(argv.endrun) : minRunLength;
const maxLength = argv.maxlen ? parseInt(argv.maxlen) : (minRunLength * sourceFileNames.length * 3);
const minLength = argv.minlen ? parseInt(argv.minlen) : ((minRunLength * sourceFileNames.length - 1) + endRunLength);
const maxTries = argv.maxtries ? parseInt(argv.maxtries) : 100;

const colors =
    [chalk.red, chalk.green, chalk.magenta, chalk.yellow, chalk.cyan];
const sourceColors = new Map<string, Chalk>();
for (const sourceFileName of sourceFileNames) {
  const sourceText = fs.readFileSync(sourceFileName).toString();
  const sourceModel = new TermTransitionModel();
  sourceModel.depth = depth;
  sourceModel.addSentences(parser.parse(sourceText));
  generator.sources.set(sourceFileName, sourceModel);
  sourceColors.set(sourceFileName, colors.pop()!);
}


const sentences = [];
let tries = 0;
while (sentences.length < sentencesToGenerate) {
  ++tries;
  if (tries > maxTries) {
    throw new Error(`Maximum number of tries ${maxTries} exceeded. Giving up.`);
  }
  const sentence = generator.generateSentence();
  const uniqueSources = [...new Set(sentence.sources)];
  if (uniqueSources.length < sourceFileNames.length) {
    continue;
  }
  let smallestRunLength = sentence.sources.length;
  let runLength = 1;
  let lastSource = sentence.sources[0]!;
  for (const nextSource of sentence.sources.slice(1)) {
    ++runLength;
    if (lastSource !== nextSource) {
      if (runLength < smallestRunLength) {
        smallestRunLength = runLength;
      }
      lastSource = nextSource;
      runLength = 0;
    }
  }
  if (smallestRunLength < minRunLength) {
    continue;
  }
  if (runLength < endRunLength - 1) {
    continue;
  }
  if (sentence.sentence.length < minLength) {
    continue;
  }
  if (sentence.sentence.length > maxLength) {
    continue;
  }
  tries = 0;
  let output = '';
  for (let t = 0; t < sentence.sentence.length; ++t) {
    if (t > 0) {
      output = output + ' ';
    }
    const word = sentence.sentence[t]!;
    const source = sentence.sources[t]!;
    const color = sourceColors.get(source)!;
    output = output + color(word);
  }
  sentences.push(sentence);
  tries = 0;
  console.log(output);
}
