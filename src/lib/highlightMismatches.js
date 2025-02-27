export function highlightMismatches(apiResponse) {
  const { text, errors, correctText } = apiResponse;

  // First pass: Mark error positions
  let markedText = text;
  let offsets = [];
  let offset = 0;

  // Sort errors by index to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.index - b.index);

  for (const error of sortedErrors) {
    // Find the actual position of the error word
    const wordToFind = error.word;

    // Start search from approximate position considering previous offsets
    const approximateIndex = error.index + offset;
    let startSearchFrom = Math.max(0, approximateIndex - 10);

    // Find the actual occurrence of the error word
    const actualIndex = markedText.indexOf(wordToFind, startSearchFrom);

    if (actualIndex >= 0) {
      // Replace the word with a highlighted version
      const beforeError = markedText.substring(0, actualIndex);
      const afterError = markedText.substring(actualIndex + wordToFind.length);

      // Use whatever highlighting format you prefer
      const highlightedError = `<span class="bg-red-300 px-1 rounded error">${wordToFind}</span>`;
      markedText = beforeError + highlightedError + afterError;

      // Update offset for future replacements
      const newOffset =
        (beforeError + highlightedError).length -
        (beforeError + wordToFind).length;
      offset += newOffset;

      // Store the mapping for verification
      offsets.push({
        originalIndex: error.index,
        actualIndex,
        word: wordToFind,
        correctWord: error.correctWord,
      });
    }
  }

  return {
    highlightedText: markedText,
    errorMapping: offsets,
  };
}
