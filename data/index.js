import csFundamentals from "./cs-fundamentals";
import numpyFundamentals from "./numpy-fundamentals";
import pytorchBasics from "./pytorch-basics";
import mlTheory from "./ml-theory";
import deepLearningLlms from "./deep-learning-llms";
import mlEngineering from "./ml-engineering";
import mlSystemDesign from "./ml-system-design";
import pytorchCoding from "./pytorch-coding";
import agentsToolUse from "./agents-tool-use";
import safetyAlignment from "./safety-alignment";

const allQuestions = [
  ...csFundamentals,
  ...numpyFundamentals,
  ...pytorchBasics,
  ...mlTheory,
  ...deepLearningLlms,
  ...mlEngineering,
  ...mlSystemDesign,
  ...pytorchCoding,
  ...agentsToolUse,
  ...safetyAlignment,
];

export default allQuestions;

export function getQuestionById(id) {
  return allQuestions.find((q) => q.id === id);
}

export function getQuestionsByCategory(slug) {
  return allQuestions.filter((q) => q.category === slug);
}

export function getQuestionsByType(type) {
  return allQuestions.filter((q) => q.type === type);
}

export function getQuestionsByDifficulty(difficulty) {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}

export function filterQuestions({ types = [], difficulties = [], categories = [] }) {
  return allQuestions.filter((q) => {
    if (types.length > 0 && !types.includes(q.type)) return false;
    if (difficulties.length > 0 && !difficulties.includes(q.difficulty)) return false;
    if (categories.length > 0 && !categories.includes(q.category)) return false;
    return true;
  });
}

export function getCategoryCounts() {
  const counts = {};
  for (const q of allQuestions) {
    if (!counts[q.category]) {
      counts[q.category] = { total: 0, coding: 0, knowledge: 0, "open-ended": 0 };
    }
    counts[q.category].total++;
    counts[q.category][q.type]++;
  }
  return counts;
}
