
export function isTerminal(term: string): boolean {
  return term.endsWith('.') || term.endsWith('!') || term.endsWith('?');
}

export class TextParser {
  public isTerminal: typeof isTerminal = isTerminal;
  parse(text: string): string[][] {
    const sentences = [];
    let sentence = [];
    for (const term of text.split(/\s+/)) {
      sentence.push(term);
      if (this.isTerminal(term)) {
        sentences.push(sentence);
        sentence = [];
      }
    }
    if (sentence.length > 0) {
      sentences.push(sentence);
    }
    return sentences;
  }
}
