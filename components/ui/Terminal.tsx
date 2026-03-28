"use client";

import React, { useEffect, useState, memo } from "react";

interface TerminalProps {
  title?: string;
  content: string;
  speed?: number; // milliseconds per character
}

const Terminal = memo(function Terminal({
  title = "$ compufest --info",
  content,
  speed = 30,
}: TerminalProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (index < content.length) {
        setDisplayedText((prev) => prev + content[index]);
        index++;
        timeoutId = setTimeout(type, speed);
      } else {
        setIsComplete(true);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [content, speed]);

  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-green-500/30 bg-black/50 backdrop-blur-sm shadow-2xl"
      style={{
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Terminal Header */}
      <div
        className="bg-gradient-to-r from-green-600/20 to-purple-600/20 px-4 py-3 border-b border-green-500/20 flex items-center gap-3"
        style={{
          background:
            "linear-gradient(to right, rgba(38, 217, 104, 0.1), rgba(138, 43, 226, 0.1))",
        }}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
        <span className="text-xs text-green-400/70 ml-4 font-mono">{title}</span>
      </div>

      {/* Terminal Content */}
      <div
        className="px-6 py-4 text-sm md:text-base text-green-400 min-h-64 md:min-h-80 overflow-y-auto"
        style={{
          textShadow: "0 0 10px rgba(38, 217, 104, 0.5)",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <div>{displayedText}</div>
        {!isComplete && (
          <span
            className="inline-block w-2 h-5 ml-1 bg-green-400 animate-pulse"
            style={{
              animation: "blink 1s steps(2) infinite",
            }}
          />
        )}
        {isComplete && (
          <span className="inline-block w-2 h-5 ml-1 bg-green-400/50 opacity-50" />
        )}
      </div>

      {/* Terminal Footer */}
      <div
        className="px-6 py-2 border-t border-green-500/10 text-xs text-green-500/50 text-right"
        style={{
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        {isComplete ? "Unidos como [1]." : "█ loading..."}
      </div>

      <style>{`
        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

export default Terminal;
