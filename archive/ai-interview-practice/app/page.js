"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { getProgress } from "@/lib/progress";
import allQuestions, { getCategoryCounts } from "@/data/index";
import ProgressBar from "@/components/ProgressBar";

export default function Dashboard() {
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    setCompletedIds(getProgress());
  }, []);

  const counts = getCategoryCounts();
  const overallDone = allQuestions.filter((q) => completedIds.includes(q.id)).length;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Engineer Interview Practice</h1>
        <p className="text-neutral-400 text-lg mb-8">
          {allQuestions.length} questions across {CATEGORIES.length} categories — coding, knowledge, and system design
        </p>
        <ProgressBar done={overallDone} total={allQuestions.length} className="max-w-md" />
      </div>

      {/* Category Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const catCounts = counts[cat.slug] || { total: 0, coding: 0, knowledge: 0, "open-ended": 0 };
            const catQuestions = allQuestions.filter((q) => q.category === cat.slug);
            const catDone = catQuestions.filter((q) => completedIds.includes(q.id)).length;
            const gradient = CATEGORY_COLORS[cat.slug];

            return (
              <Link
                key={cat.slug}
                href={`/practice?category=${cat.slug}`}
                className="group block"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition-all hover:shadow-lg hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-lg`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {cat.label}
                      </h2>
                      <p className="text-xs text-neutral-500">{catCounts.total} questions</p>
                    </div>
                  </div>

                  {/* Type breakdown */}
                  <div className="flex gap-3 text-xs text-neutral-400 mb-3">
                    {catCounts.coding > 0 && (
                      <span className="text-blue-400">{catCounts.coding} coding</span>
                    )}
                    {catCounts.knowledge > 0 && (
                      <span className="text-purple-400">{catCounts.knowledge} knowledge</span>
                    )}
                    {catCounts["open-ended"] > 0 && (
                      <span className="text-teal-400">{catCounts["open-ended"]} open-ended</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-300`}
                      style={{ width: `${catCounts.total === 0 ? 0 : (catDone / catCounts.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{catDone}/{catCounts.total} completed</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
