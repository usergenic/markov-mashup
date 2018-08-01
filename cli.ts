import * as fs from 'fs';
import {TermTransitionModel} from './term-transition-model';
import {TextGenerator} from './text-generator';
import {TextParser} from './text-parser';

import minimist = require('minimist');
import * as process from 'process';

const argv = minimist(process.argv.slice(2));
const sentencesToGenerate = argv.sentences || 10;
const sourceFileNames = argv._;
const depth = argv.depth ? parseInt(argv.depth) : 2;
const generator = new TextGenerator();
const parser = new TextParser();

for (const sourceFileName of sourceFileNames) {
  const sourceText = fs.readFileSync(sourceFileName).toString();
  const sourceModel = new TermTransitionModel();
  sourceModel.depth = depth;
  sourceModel.addSentences(parser.parse(sourceText));
  generator.sources.set(sourceFileName, sourceModel);
}

const sentences = [];
while (sentences.length < sentencesToGenerate) {
  const sentence = generator.generateSentence();
  const uniqueSources = [...new Set(sentence.sources) ];
  if (uniqueSources.length < sourceFileNames.length) {
    continue;
  }
  sentences.push(sentence);
  console.log(sentence.sentence);
}
