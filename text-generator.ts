import {TermTransitionModel} from './term-transition-model';
import {isTerminal} from './text-parser';

export class TextGenerator {
  public sources: Map<string, TermTransitionModel> = new Map();
  public isTerminal: typeof isTerminal = isTerminal;
  public random: typeof Math.random = Math.random;
  getSourceKeys() {}
  pickSource(): TermTransitionModel {
    const sourceKeys = [...this.sources.keys()];
    if (sourceKeys.length < 1) {
      throw new Error('No sources to pick from.');
    }
    const sourceKey = sourceKeys[Math.floor(sourceKeys.length * this.random())];
    return this.sources.get(sourceKey)!;
  }
  generateSentence() {
    const sourceKeys = [...this.sources.keys()];
    let sentence = [];
    let sourceKey = this.pickOne(sourceKeys);
    let source = this.sources.get(sourceKey)!;
    let term = this.pickOne(source.transitions.get('')!);
    sentence.push(term);
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
      sourceKey = candidateSourceKeys[0];
      term = this.pickOne(this.sources.get(sourceKey)!.getTransitions(from)!);
      sentence.push(term);
    }
    return sentence.join(' ');
  }
  pickOne<T>(array: Array<T>): T {
    return array[Math.floor(array.length * this.random())];
  }
}
