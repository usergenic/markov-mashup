import {expect} from 'chai';

import {TermTransitionModel} from '../term-transition-model';
import {TextGenerator} from '../text-generator';
import {TextParser} from '../text-parser';

describe('TextGenerator', () => {
  it('generates text from a single source', () => {
    const generator = new TextGenerator();
    const parser = new TextParser();
    const qbf = new TermTransitionModel();
    qbf.addSentences(
        parser.parse('The quick brown fox jumped over the lazy dog.'));
    generator.sources.set('qbf', qbf);
    const sentence = generator.generateSentence().sentence.join(' ');
    expect(sentence).to.equal('The quick brown fox jumped over the lazy dog.');
  });

  it('generates text from multiple sources', () => {
    const generator = new TextGenerator();
    const parser = new TextParser();
    const qbf = new TermTransitionModel();
    qbf.addSentences(
        parser.parse('The quick brown fox jumped over the lazy dog.'));
    generator.sources.set('qbf', qbf);
    const sotr = new TermTransitionModel();
    sotr.addSentences(
        parser.parse('Somewhere over the rainbow way up high...'));
    generator.sources.set('sotr', sotr);
    generator.random = () => 0;
    expect(generator.generateSentence().sentence.join(' '))
        .to.equal('The quick brown fox jumped over the rainbow way up high...');
    generator.random = () => 0.9;
    expect(generator.generateSentence().sentence.join(' '))
        .to.equal('Somewhere over the lazy dog.');
  });
});
