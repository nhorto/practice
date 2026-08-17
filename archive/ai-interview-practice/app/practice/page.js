"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import allQuestions, { filterQuestions } from "@/data/index";
import { getProgress, markComplete, markIncomplete } from "@/lib/progress";
import Sidebar from "@/components/Sidebar";
import CodingQuestion from "@/components/CodingQuestion";
import KnowledgeQuestion from "@/components/KnowledgeQuestion";
import OpenEndedQuestion from "@/components/OpenEndedQuestion";

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [filters, setFilters] = useState({
    types: [],
    difficulties: [],
    categories: initialCategory ? [initialCategory] : [],
  });
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    setCompletedIds(getProgress());
  }, []);

  // Apply filters
  const filteredQuestions = filters.types.length === 0 && filters.difficulties.length === 0 && filters.categories.length === 0
    ? allQuestions
    : filterQuestions(filters);

  // Auto-select first question when filters change
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      if (!selectedId || !filteredQuestions.find((q) => q.id === selectedId)) {
        setSelectedId(filteredQuestions[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredQuestions, selectedId]);

  // Set initial category from URL
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({
        ...prev,
        categories: [initialCategory],
      }));
    }
  }, [initialCategory]);

  const selectedQuestion = allQuestions.find((q) => q.id === selectedId);

  const handleToggleComplete = useCallback((id) => {
    setCompletedIds((prev) => {
      if (prev.includes(id)) {
        markIncomplete(id);
        return prev.filter((cid) => cid !== id);
      } else {
        markComplete(id);
        return [...prev, id];
      }
    });
  }, []);

  // Prev/Next navigation
  const currentIndex = filteredQuestions.findIndex((q) => q.id === selectedId);

  const goPrev = () => {
    if (currentIndex > 0) {
      setSelectedId(filteredQuestions[currentIndex - 1].id);
    }
  };

  const goNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setSelectedId(filteredQuestions[currentIndex + 1].id);
    }
  };

  const renderQuestion = () => {
    if (!selectedQuestion) {
      return (
        <div className="flex items-center justify-center h-full text-neutral-500">
          <p>No question selected. Choose one from the sidebar or adjust your filters.</p>
        </div>
      );
    }

    const isCompleted = completedIds.includes(selectedQuestion.id);

    switch (selectedQuestion.type) {
      case "coding":
        return (
          <CodingQuestion
            key={selectedQuestion.id}
            question={selectedQuestion}
            completed={isCompleted}
            onToggleComplete={handleToggleComplete}
          />
        );
      case "knowledge":
        return (
          <KnowledgeQuestion
            key={selectedQuestion.id}
            question={selectedQuestion}
            completed={isCompleted}
            onToggleComplete={handleToggleComplete}
          />
        );
      case "open-ended":
        return (
          <OpenEndedQuestion
            key={selectedQuestion.id}
            question={selectedQuestion}
            completed={isCompleted}
            onToggleComplete={handleToggleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        questions={allQuestions}
        filters={filters}
        onFilterChange={setFilters}
        selectedId={selectedId}
        onSelectQuestion={setSelectedId}
        completedIds={completedIds}
        filteredQuestions={filteredQuestions}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Nav Bar */}
        {selectedQuestion && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900/50">
            <button
              onClick={goPrev}
              disabled={currentIndex <= 0}
              className="text-sm text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous
            </button>
            <span className="text-xs text-neutral-500">
              {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentIndex >= filteredQuestions.length - 1}
              className="text-sm text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        )}

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl">
            {renderQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-neutral-500">Loading...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
