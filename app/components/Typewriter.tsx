"use client";

import { useState, useEffect, useCallback } from "react";

const phrases = [
  "Build a game that tracks high scores...",
  "Build an app to manage my daily tasks...",
  "Build a weather dashboard with charts...",
  "Build a chat bot for customer support...",
  "Build a recipe finder with filters...",
  "Build a portfolio website with animations...",
];

const TYPING_SPEED = 60;
const DELETING_SPEED = 35;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETING = 400;

export default function Typewriter() {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      const next = currentPhrase.slice(0, text.length + 1);
      setText(next);

      if (next === currentPhrase) {
        // Finished typing — pause then start deleting
        setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
        return;
      }
    } else {
      // Deleting
      const next = currentPhrase.slice(0, text.length - 1);
      setText(next);

      if (next === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTimeout(() => {}, PAUSE_AFTER_DELETING);
        return;
      }
    }
  }, [text, phraseIndex, isDeleting]);

  useEffect(() => {
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return (
    <span>
      {text}
      <span className="animate-pulse text-amber-500">|</span>
    </span>
  );
}
