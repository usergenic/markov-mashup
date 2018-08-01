import {expect} from 'chai';

import {TextParser} from '../text-parser';

describe('TextParser', () => {
  it('parses text into sentences', () => {
    const parser = new TextParser();
    const sentences =
        parser.parse('Once upon a time there was a cat.  It was a great cat.');
    expect(sentences.length).to.equal(2);
    expect(sentences[0]).to.deep.equal([
      'Once', 'upon', 'a', 'time', 'there', 'was', 'a', 'cat.'
    ]);
    expect(sentences[1]).to.deep.equal([ 'It', 'was', 'a', 'great', 'cat.' ])
  });
});
