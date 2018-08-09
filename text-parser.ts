
export function isTerminal(term: string): boolean {
  // Meant to catch all 2 and 3 letter capitalized abbreviations ending with a
  // period, like "Dr." and "Mrs." and "Ave."
  if (term.endsWith('.') && term[0] === term[0].toUpperCase() &&
      term.length <= 4) {
    return false;
  }
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
