"use client";

import { useState, useRef} from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Home() {
  const [message, setMessage] = useState("");
  const [outputText, setOutputText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const textareaRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Handle input with debouncing
  const handleInput = (e) => {
    const text = e.target.value;
    setMessage(text);
    autoResize(e.target);

    // Debounce the API request
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (text.trim()) {
        sendToApi(text);
      }
    }, 2000); // 2s debounce time
  };

  // Automatically resize textarea
  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Sends text to API for correction
  const sendToApi = async (text) => {
    try {
      const { data } = await axios.post("/api/correct", { text });
      if (data.correctedText) {
        setOutputText(data.correctedText);
        highlightIncorrectWords(text, data.correctedText);
      }
    } catch (error) {
      console.error("Error correcting text:", error);
      toast.error("Error correcting text");
    }
  };

  const highlightIncorrectWords = (original, corrected) => {
    const originalWords = original.split(" ");
    const correctedWords = corrected.split(" ");

    const highlighted = originalWords
      .map((word, index) => {
        const correctedWord = correctedWords[index] || word;

        if (
          word.toLowerCase() === correctedWord.toLowerCase() &&
          word !== correctedWord
        ) {
          // Case difference: underline the word
          return `<span class="underline">${correctedWord}</span>`;
        } else if (word !== correctedWord) {
          // Actual word mismatch: highlight with background
          return `<span class="bg-red-300 px-1 rounded">${correctedWord}</span>`;
        }

        return word; // No change
      })
      .join(" ");

    setHighlightedText(highlighted);
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="w-[90%] lg:w-[60%] mx-auto">
        <div className="space-y-8">
          {/* Output Section */}
          <div className="w-full space-y-2 text-[#133C38] text-[1rem] px-4 py-2 bg-[#EFEFEF] shadow-none outline-none rounded-xl border border-solid border-[#EFEFEF]">
            <span className="font-bold text-md">Output</span>
            <div
              className="w-full min-h-[5rem] text-[#434343] resize-none overflow-hidden bg-transparent outline-none"
              dangerouslySetInnerHTML={{
                __html: highlightedText || outputText,
              }}
            />
          </div>

          {/* Input Section */}
          <div className="flex items-center w-full  text-[#133C38] text-[1rem] px-4 py-2 bg-[#ffffff] shadow-none outline-none rounded-xl border border-solid border-[#cecece]">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              rows={5}
              placeholder="Start typing..."
              className="w-full text-[#434343] resize-none overflow-hidden bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
