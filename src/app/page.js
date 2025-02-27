"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { highlightMismatches } from "@/lib/highlightMismatches";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputErrors, setInputErrors] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const textareaRef = useRef(null);
  const debounceTimeout = useRef(null);
  const pendingRequestRef = useRef({ text: "", timestamp: 0 });
  const interval = 500;

  const handleInput = (e) => {
    const text = e.target.value;

    // Handle empty text case
    if (text?.trim()?.length === 0) {
      setOutputText("");
      setInputText("");
      return;
    }

    setInputText(text);

    // Always update output with the latest input text
    // This ensures users see what they're typing immediately
    setOutputText(text);
    autoResize(e.target);

    // Debounce API calls to avoid overwhelming the server
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      if (text.trim()) {
        // Track the current request with a timestamp
        const timestamp = Date.now();
        pendingRequestRef.current = { text, timestamp };
        setIsChecking(true);
        await sendToApi(text, timestamp);
        setIsChecking(false);
      }
    }, interval);
  };

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const sendToApi = async (text, requestTimestamp) => {
    try {
      // Make the API call
      const { data } = await axios.post("/api/correct", { text });

      // Ignore stale responses (if user has made a newer request)
      if (requestTimestamp !== pendingRequestRef.current.timestamp) {
        return;
      }

      // Handle case where API returns no data
      if (!data) {
        return;
      }

      const { errors } = data;
      // console.log(errors, "errors");
      setInputErrors(errors);
    } catch (error) {
      console.error("Error correcting text:", error);
      toast.error("Error correcting text");
    }
  };

  useEffect(() => {
    const text = inputText;
    // console.log(inputErrors, "errors useEffect");
    let newText = text;
    if (inputErrors && inputErrors.length) {
      newText = highlightMismatches(inputErrors, inputText);
    }

    // console.log(newText === outputText, "text ", newText);
    if (newText != outputText) {
      // console.log(text, "error text");
      setOutputText(newText);
    }
  }, [inputErrors, inputText]);

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="w-[90%] lg:w-[60%] mx-auto">
        <div className="space-y-8">
          <div className=" relative w-full space-y-2 text-[#133C38] text-[1rem] px-4 py-2 bg-[#EFEFEF] shadow-none outline-none rounded-xl border border-solid border-[#EFEFEF]">
            <span className="font-bold text-md">Output</span>
            {isChecking ? (
              <img
                src="/spinner.svg"
                width={45}
                height={"auto"}
                className="bg-transparent absolute right-2 -top-2"
              />
            ) : null}
            <div className="w-full min-h-[5rem] text-[#434343] resize-none overflow-hidden bg-transparent outline-none">
              {inputText?.trim() ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: outputText,
                  }}
                />
              ) : (
                <span className="text-gray-400">
                  Output will appear here...
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center w-full  text-[#133C38] text-[1rem] px-4 py-2 bg-[#ffffff] shadow-none outline-none rounded-xl border border-solid border-[#cecece]">
            <textarea
              ref={textareaRef}
              value={inputText}
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
