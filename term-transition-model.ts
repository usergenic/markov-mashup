export function simplifyFrom(term: string): string {
  return term.toLowerCase().replace(/[^a-z ]+/g, '');
}

export class TermTransitionModel {
  public depth: number = 2;
  public simplifyKey: typeof simplifyFrom = simplifyFrom;
  public transitions: Map<string, string[]> = new Map();
  addSentences(sentences: string[][]) {
    for (const sentence of sentences) {
      this.addSentence(sentence);
    }
  }
  addSentence(sentence: string[]) {
    const fromSequence: string[] = [];
    for (const term of sentence) {
      this.addTransition(fromSequence.join(' '), term);
      fromSequence.push(term);
      if (fromSequence.length > this.depth) {
        fromSequence.shift();
      }
    }
  }
  addTransition(from: string, to: string) {
    from = this.simplifyKey(from);
    this.transitions.has(from) ? this.transitions.get(from)!.push(to)
                               : this.transitions.set(from, [ to ]);
  }
  getTransitions(from: string): string[]|undefined {
    return this.transitions.get(this.simplifyKey(from));
  }
}
