import defaultPostes from "../constants/defaultPostes";

const STORAGE_KEY = "crm_postes_usage";

export function getPostesSuggestions() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  const learned = Object.keys(stored).sort((a, b) => stored[b] - stored[a]);

  const filteredDefaults = defaultPostes.filter((p) => !learned.includes(p));

  return {
    frequent: learned.slice(0, 5),
    others: [...learned.slice(5), ...filteredDefaults].sort(),
  };
}

export function registerPosteUsage(poste) {
  if (!poste || poste.trim().length < 2) return;

  const formattedPoste =
    poste.trim().charAt(0).toUpperCase() + poste.trim().slice(1).toLowerCase();
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  stored[formattedPoste] = (stored[formattedPoste] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
