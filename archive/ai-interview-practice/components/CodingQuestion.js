"use client";

import { useState } from "react";
import CodeEditor from "./CodeEditor";
import DifficultyBadge from "./DifficultyBadge";
import TypeBadge from "./TypeBadge";

export default function CodingQuestion({ question, completed, onToggleComplete }) {
  const [code, setCode] = useState(question.starterCode || "");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

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

      {/* Code Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-neutral-300">Your Solution</h3>
          <button
            onClick={() => setCode(question.starterCode || "")}
            className="text-xs text-neutral-400 hover:text-white transition-colors px-2 py-1 rounded border border-neutral-700 hover:border-neutral-500"
          >
            Reset Code
          </button>
        </div>
        <CodeEditor value={code} onChange={setCode} />
      </div>

      {/* Test Cases */}
      {question.testCases && (
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-2">Test Cases</h3>
          <pre className="bg-neutral-950 text-neutral-300 font-mono text-sm p-4 rounded-lg border border-neutral-700 overflow-x-auto">
            {Array.isArray(question.testCases)
              ? question.testCases.map((tc, i) =>
                  typeof tc === "string"
                    ? tc + (i < question.testCases.length - 1 ? "\n" : "")
                    : `Test ${i + 1}: ${tc.name || ""}\n  Input: ${tc.input}\n  Expected: ${tc.expected}\n`
                ).join("\n")
              : question.testCases}
          </pre>
        </div>
      )}

      {/* Hint */}
      <div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        {showHint && (
          <div className="mt-2 bg-amber-950/30 border border-amber-800/50 rounded-lg p-4 text-amber-200 text-sm">
            {question.hint}
          </div>
        )}
      </div>

      {/* Solution */}
      <div>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
        {showSolution && (
          <div className="mt-2 space-y-3">
            <CodeEditor value={question.solution} readOnly />
            {question.explanation && (
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-neutral-300 text-sm whitespace-pre-wrap">
                {question.explanation}
              </div>
            )}
            {(question.timeComplexity || question.spaceComplexity) && (
              <div className="flex gap-4 text-sm text-neutral-400">
                {question.timeComplexity && <span>Time: {question.timeComplexity}</span>}
                {question.spaceComplexity && <span>Space: {question.spaceComplexity}</span>}
              </div>
            )}
          </div>
        )}
      </div>

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
