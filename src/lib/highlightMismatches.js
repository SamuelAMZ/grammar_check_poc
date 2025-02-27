export function highlightMismatches(errors, inputText) {
  // Only process if we have errors to highlight
  if (errors && errors.length > 0) {
    // Create a copy of the current input
    // This is important - we want to highlight the current text
    // not the text that was sent to the API
    let currentText = inputText;

    // Sort errors by index (highest to lowest to avoid position shifts)
    const sortedErrors = [...errors].sort((a, b) => b.index - a.index);

    // Process each error
    sortedErrors.forEach((error) => {
      const { word } = error;

      // Find the real position of the error word in the current text
      // We need to do this instead of using the index because the user might have
      // continued typing, changing the position
      const wordPosition = currentText.indexOf(word);

      if (wordPosition >= 0) {
        // Highlight the error
        const highlightedError = `<span class="text-red-500 underline error">${word}</span>`;

        // Replace the error word with its highlighted version
        currentText =
          currentText.substring(0, wordPosition) +
          highlightedError +
          currentText.substring(wordPosition + word.length);
      }
    });

    return currentText;
  }
}
