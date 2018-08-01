import {expect} from 'chai';

import {TermTransitionModel} from '../term-transition-model';
import {TextParser} from '../text-parser';

describe('TermTransitionModel', () => {
  it('can add transitions from terms in sentences', () => {
    const parser = new TextParser();
    const ttm = new TermTransitionModel();
    const sentences =
        parser.parse('The quick brown fox jumped over the lazy dog.');
    ttm.addSentences(sentences);
    expect(ttm.getTransitions('quick brown')).to.deep.equal([ 'fox' ]);
    expect(ttm.getTransitions('quick black')).to.equal(undefined);
    expect(ttm.getTransitions('quick')).to.equal(undefined);
  });

  it('can add transitions from terms in sentences with different depth', () => {
    const parser = new TextParser();
    const ttm = new TermTransitionModel();
    ttm.depth = 3;
    const sentences =
        parser.parse('The quick brown fox jumped over the lazy dog.');
    ttm.addSentences(sentences);
    expect(ttm.getTransitions('quick brown')).to.equal(undefined);
    expect(ttm.getTransitions('quick black')).to.equal(undefined);
    expect(ttm.getTransitions('quick')).to.equal(undefined);
    expect(ttm.getTransitions('the quick brown')).to.deep.equal([ 'fox' ]);
    expect(ttm.getTransitions('the quick black')).to.equal(undefined);
    expect(ttm.getTransitions('the quick')).to.deep.equal([ 'brown' ]);
  });
});
