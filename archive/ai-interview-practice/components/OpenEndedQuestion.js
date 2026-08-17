"use client";

import { useState } from "react";
import DifficultyBadge from "./DifficultyBadge";
import TypeBadge from "./TypeBadge";

export default function OpenEndedQuestion({ question, completed, onToggleComplete }) {
  const [response, setResponse] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [checkedRubric, setCheckedRubric] = useState({});

  const toggleRubricItem = (idx) => {
    setCheckedRubric((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const rubricCount = question.rubric
    ? Object.values(checkedRubric).filter(Boolean).length
    : 0;

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

      {/* Context */}
      {question.context && (
        <div className="bg-blue-950/20 border border-blue-800/40 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-300 mb-1">Context</h3>
          <p className="text-neutral-300 text-sm">{question.context}</p>
        </div>
      )}

      {/* Question */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
        <p className="text-neutral-200 whitespace-pre-wrap">{question.question}</p>
      </div>

      {/* Response Area */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-2">Your Response</h3>
        <textarea
          className="w-full bg-neutral-950 text-neutral-200 p-4 rounded-lg border border-neutral-700 resize-y min-h-[250px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Write your response here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      {/* Rubric */}
      {question.rubric && question.rubric.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-2">
            Self-Assessment Rubric ({rubricCount}/{question.rubric.length})
          </h3>
          <div className="space-y-2">
            {question.rubric.map((item, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!checkedRubric[idx]}
                  onChange={() => toggleRubricItem(idx)}
                  className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-sm text-neutral-300">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sample Answer */}
      <div>
        <button
          onClick={() => setShowSample(!showSample)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showSample ? "Hide Sample Answer" : "Show Sample Answer"}
        </button>
        {showSample && (
          <div className="mt-2 space-y-3">
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-neutral-300 text-sm whitespace-pre-wrap">
              {question.sampleAnswer}
            </div>
            {question.keyPoints && question.keyPoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-300 mb-1">Key Points</h4>
                <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                  {question.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
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
