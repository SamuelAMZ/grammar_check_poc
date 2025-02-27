export function highlightMismatches(errors, text) {
  let markedText = text;
  let offset = 0;
  // Track the last matched index
  let previousIndex = 0;

  // Sort errors by index to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.index - b.index);

  for (const error of sortedErrors) {
    const wordToFind = error.word;

    // Start searching from the last modified index
    const actualIndex = markedText.indexOf(wordToFind, previousIndex);

    if (actualIndex >= 0) {
      // Replace the word with a highlighted version
      const beforeError = markedText.substring(0, actualIndex);
      const afterError = markedText.substring(actualIndex + wordToFind.length);
      const highlightedError = `<span class="bg-red-300 px-1 rounded error">${wordToFind}</span>`;

      markedText = beforeError + highlightedError + afterError;

      // Update previous index to start next search from this error position
      previousIndex = actualIndex + highlightedError.length;
    }
  }

  return markedText;
}
