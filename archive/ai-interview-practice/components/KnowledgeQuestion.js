"use client";

import { useState } from "react";
import DifficultyBadge from "./DifficultyBadge";
import TypeBadge from "./TypeBadge";

export default function KnowledgeQuestion({ question, completed, onToggleComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const isMultipleChoice = question.format === "multiple-choice";
  const hasAnswered = isMultipleChoice ? selectedOption !== null : showAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <DifficultyBadge difficulty={question.difficulty} />
          <TypeBadge type={question.type} />
          {question.tags?.map((tag) => (
            <span key={tag} className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white">{question.title}</h2>
        <p className="text-sm text-neutral-400 mt-1">{question.categoryLabel}</p>
      </div>

      {/* Question */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
        <p className="text-neutral-200 whitespace-pre-wrap">{question.question}</p>
      </div>

      {/* Multiple Choice Options */}
      {isMultipleChoice && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isCorrect = opt.id === question.correctAnswer;
            const isSelected = selectedOption === opt.id;
            let optionClass = "border-neutral-700 bg-neutral-900 hover:border-neutral-500";

            if (selectedOption !== null) {
              if (isCorrect) {
                optionClass = "border-emerald-600 bg-emerald-950/30";
              } else if (isSelected && !isCorrect) {
                optionClass = "border-red-600 bg-red-950/30";
              } else {
                optionClass = "border-neutral-700 bg-neutral-900 opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => selectedOption === null && setSelectedOption(opt.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${optionClass}`}
                disabled={selectedOption !== null}
              >
                <span className="text-sm font-mono text-neutral-500 mr-3">{opt.id.toUpperCase()}.</span>
                <span className="text-neutral-200">{opt.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Short Answer */}
      {!isMultipleChoice && (
        <div>
          <textarea
            className="w-full bg-neutral-950 text-neutral-200 p-4 rounded-lg border border-neutral-700 resize-y min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
        </div>
      )}

      {/* Explanation */}
      {hasAnswered && question.explanation && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-neutral-300 mb-2">Explanation</h3>
          <p className="text-neutral-300 text-sm whitespace-pre-wrap">{question.explanation}</p>
        </div>
      )}

      {/* Show answer for short-answer */}
      {showAnswer && !isMultipleChoice && question.correctAnswer && (
        <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-emerald-300 mb-2">Model Answer</h3>
          <p className="text-neutral-300 text-sm whitespace-pre-wrap">{question.correctAnswer}</p>
        </div>
      )}

      {/* Complete Toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(question.id)}
          className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
        />
        <span className="text-sm text-neutral-300">Mark as Complete</span>
      </label>
    </div>
  );
}
