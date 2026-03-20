export const CATEGORIES = [
  { slug: "cs-fundamentals", label: "CS Fundamentals", icon: "🖥️" },
  { slug: "ml-theory", label: "ML Theory", icon: "📊" },
  { slug: "deep-learning-llms", label: "Deep Learning & LLMs", icon: "🧠" },
  { slug: "ml-engineering", label: "ML Engineering", icon: "⚙️" },
  { slug: "ml-system-design", label: "ML System Design", icon: "🏗️" },
  { slug: "pytorch-coding", label: "PyTorch & Implementation", icon: "🔥" },
  { slug: "safety-alignment", label: "Safety & Alignment", icon: "🛡️" },
];

export const DIFFICULTIES = [
  { value: "core", label: "Core" },
  { value: "standard", label: "Standard" },
  { value: "stretch", label: "Stretch" },
];

export const TYPES = [
  { value: "coding", label: "Coding" },
  { value: "knowledge", label: "Knowledge" },
  { value: "open-ended", label: "Open-Ended" },
];

export const DIFFICULTY_COLORS = {
  core: { bg: "bg-emerald-900/50", text: "text-emerald-300", border: "border-emerald-700" },
  standard: { bg: "bg-amber-900/50", text: "text-amber-300", border: "border-amber-700" },
  stretch: { bg: "bg-rose-900/50", text: "text-rose-300", border: "border-rose-700" },
};

export const TYPE_COLORS = {
  coding: { bg: "bg-blue-900/50", text: "text-blue-300", border: "border-blue-700" },
  knowledge: { bg: "bg-purple-900/50", text: "text-purple-300", border: "border-purple-700" },
  "open-ended": { bg: "bg-teal-900/50", text: "text-teal-300", border: "border-teal-700" },
};

export const CATEGORY_COLORS = {
  "cs-fundamentals": "from-blue-600 to-blue-800",
  "ml-theory": "from-purple-600 to-purple-800",
  "deep-learning-llms": "from-pink-600 to-pink-800",
  "ml-engineering": "from-orange-600 to-orange-800",
  "ml-system-design": "from-cyan-600 to-cyan-800",
  "pytorch-coding": "from-red-600 to-red-800",
  "safety-alignment": "from-green-600 to-green-800",
};
