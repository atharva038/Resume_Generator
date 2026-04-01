export const getScoreTierMeta = (
  score,
  thresholds = {high: 75, medium: 50}
) => {
  if (score >= thresholds.high) {
    return {
      textClass: "text-green-600 dark:text-green-400",
      badgeClass:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800",
      panelClass:
        "text-green-600 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400",
      ringStart: "#10b981",
      ringEnd: "#059669",
      solid: "#10b981",
      level: "Strong Match",
    };
  }

  if (score >= thresholds.medium) {
    return {
      textClass: "text-orange-600 dark:text-orange-400",
      badgeClass:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
      panelClass:
        "text-yellow-600 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400",
      ringStart: "#f59e0b",
      ringEnd: "#d97706",
      solid: "#f59e0b",
      level: "Needs Tuning",
    };
  }

  return {
    textClass: "text-red-600 dark:text-red-400",
    badgeClass:
      "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
    panelClass:
      "text-red-600 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400",
    ringStart: "#ef4444",
    ringEnd: "#dc2626",
    solid: "#ef4444",
    level: "Low Match",
  };
};
