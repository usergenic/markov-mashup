import {TermTransitionModel} from './term-transition-model';
import {isTerminal} from './text-parser';

export class TextGenerator {
  public sources: Map<string, TermTransitionModel> = new Map();
  public isTerminal: typeof isTerminal = isTerminal;
  public random: typeof Math.random = Math.random;
  public minRunLength: number = 3;
  getSourceKeys() {}
  pickSource(): TermTransitionModel {
    const sourceKeys = [...this.sources.keys()];
    if (sourceKeys.length < 1) {
      throw new Error('No sources to pick from.');
    }
    const sourceKey = sourceKeys[Math.floor(sourceKeys.length * this.random())];
    return this.sources.get(sourceKey)!;
  }
  generateSentence(): {sentence: string[], sources: string[]} {
    const sourceKeys = [...this.sources.keys()];
    const sourceSequence = [];
    let sentence = [];
    let sourceKey = this.pickOne(sourceKeys);
    let source = this.sources.get(sourceKey)!;
    let term = this.pickOne(source.transitions.get('')!);
    let sourceRunLength = 1;
    sentence.push(term);
    sourceSequence.push(sourceKey);
    while (!this.isTerminal(term)) {
      const from = sentence.slice(-source.depth).join(' ');
      const candidateSourceKeys =
          sourceKeys
              .filter(
                  (sourceKey) =>
                      !!this.sources.get(sourceKey)!.getTransitions(from))
              .sort(() => Math.floor(this.random() * 2) - 1)
              // This sort puts the current source at the end of the candidate
              // set so we prefer source switch.
              .sort((a, b) => a === sourceKey ? 1 : b === sourceKey ? -1 : 0);
      if (candidateSourceKeys.length === 0) {
        break;
      }
      const nextSourceKey = sourceRunLength < this.minRunLength ?
          candidateSourceKeys.pop()! :
          candidateSourceKeys.shift()!;
      if (sourceKey !== nextSourceKey) {
        sourceRunLength = 1;
      } else {
        ++sourceRunLength;
      }
      sourceKey = nextSourceKey;
      term = this.pickOne(this.sources.get(sourceKey)!.getTransitions(from)!);
      sentence.push(term);
      sourceSequence.push(sourceKey);
    }
    return {sentence: sentence, sources: sourceSequence};
  }
  pickOne<T>(array: Array<T>): T {
    return array[Math.floor(array.length * this.random())];
  }
}
