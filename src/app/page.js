"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { highlightMismatches } from "@/lib/highlightMismatches";

export default function Home() {
  const [message, setMessage] = useState("");
  const [outputText, setOutputText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const textareaRef = useRef(null);
  const debounceTimeout = useRef(null);

  const handleInput = (e) => {
    const text = e.target.value;
    setMessage(text);
    autoResize(e.target);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (text.trim()) {
        sendToApi(text);
      }
    }, 2000);
  };

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const sendToApi = async (text) => {
    try {
      const { data } = await axios.post("/api/correct", { text: text });
      const { correctText, errors } = data;

      if (correctText) {
        setOutputText(correctText);
        const { highlightedText } = highlightMismatches({
          text,
          correctText,
          errors,
        });
        setHighlightedText(highlightedText);
      }
    } catch (error) {
      console.error("Error correcting text:", error);
      toast.error("Error correcting text");
    }
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="w-[90%] lg:w-[60%] mx-auto">
        <div className="space-y-8">
          <div className="w-full space-y-2 text-[#133C38] text-[1rem] px-4 py-2 bg-[#EFEFEF] shadow-none outline-none rounded-xl border border-solid border-[#EFEFEF]">
            <span className="font-bold text-md">Output</span>
            <div
              className="w-full min-h-[5rem] text-[#434343] resize-none overflow-hidden bg-transparent outline-none"
              dangerouslySetInnerHTML={{
                __html: highlightedText || outputText,
              }}
            />
          </div>

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
