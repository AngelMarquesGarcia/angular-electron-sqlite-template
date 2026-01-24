export function countWordsInSentence(sentence: string) {
  const trimmedSentence = sentence.trim();

    // Count characters
    let charCount = sentence.length;
    let wordCount = 0;

    // Count words
    if (trimmedSentence.length !== 0) {
      wordCount = trimmedSentence.split(/\s+/).length;
    }
    return {chars:charCount, words:wordCount}
}
