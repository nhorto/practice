const STORAGE_KEY = "ai-engineer-practice-progress";

function getStoredData() {
  if (typeof window === "undefined") return { completedIds: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { completedIds: [] };
  } catch {
    return { completedIds: [] };
  }
}

function setStoredData(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress() {
  return getStoredData().completedIds;
}

export function isComplete(id) {
  return getStoredData().completedIds.includes(id);
}

export function markComplete(id) {
  const data = getStoredData();
  if (!data.completedIds.includes(id)) {
    data.completedIds.push(id);
    setStoredData(data);
  }
  return data.completedIds;
}

export function markIncomplete(id) {
  const data = getStoredData();
  data.completedIds = data.completedIds.filter((cid) => cid !== id);
  setStoredData(data);
  return data.completedIds;
}

export function getCategoryProgress(slug, questions) {
  const completed = getStoredData().completedIds;
  const categoryQs = questions.filter((q) => q.category === slug);
  const done = categoryQs.filter((q) => completed.includes(q.id)).length;
  return { done, total: categoryQs.length };
}

export function getOverallProgress(questions) {
  const completed = getStoredData().completedIds;
  const done = questions.filter((q) => completed.includes(q.id)).length;
  return { done, total: questions.length };
}
