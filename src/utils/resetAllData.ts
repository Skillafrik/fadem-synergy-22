
export const resetAllData = () => {
  // Supprimer toutes les données du localStorage
  const keys = Object.keys(localStorage);
  
  // Filtrer seulement les clés de l'application Fadem
  const fademKeys = keys.filter(key => 
    key.includes('vehicules') || 
    key.includes('immobilier') || 
    key.includes('comptabilite') ||
    key.includes('personnel') ||
    key.includes('btp') ||
    key.includes('rapports') ||
    key.includes('fadem')
  );
  
  // Supprimer toutes les données Fadem
  fademKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Toutes les données ont été supprimées du localStorage');
  
  // Recharger la page pour réinitialiser l'état
  window.location.reload();
};
