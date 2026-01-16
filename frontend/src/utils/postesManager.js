// src/utils/postesManager.js
import defaultPostes from "../constants/defaultPostes";

const STORAGE_KEY = "crm_postes_usage";

export function getPostesSuggestions() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  // On trie par fréquence d'utilisation
  const learned = Object.keys(stored).sort((a, b) => stored[b] - stored[a]);

  // On crée une liste unique : Postes les plus utilisés d'abord, puis le reste
  // On filtre pour éviter les doublons avec les postes par défaut
  const filteredDefaults = defaultPostes.filter(p => !learned.includes(p));

  return {
    frequent: learned.slice(0, 5), // Les 5 plus utilisés
    others: [...learned.slice(5), ...filteredDefaults].sort() // Le reste par ordre alphabétique
  };
}

export function registerPosteUsage(poste) {
  if (!poste || poste.trim().length < 2) return;
  
  const formattedPoste = poste.trim().charAt(0).toUpperCase() + poste.trim().slice(1).toLowerCase();
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  stored[formattedPoste] = (stored[formattedPoste] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}