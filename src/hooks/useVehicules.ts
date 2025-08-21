import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { Vehicule, ProprietaireVehicule, ContratVehicule, HistoriqueLocation } from '@/types';

interface VehiculesData {
  vehicules: Vehicule[];
  proprietaires: ProprietaireVehicule[];
  contrats: ContratVehicule[];
  historique: HistoriqueLocation[];
}

const initialData: VehiculesData = {
  vehicules: [],
  proprietaires: [],
  contrats: [],
  historique: []
};

export const useVehicules = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<VehiculesData>('vehicules', initialData);

  // Véhicules Management
  const ajouterVehicule = (vehicule: Omit<Vehicule, 'id' | 'dateEnregistrement'>) => {
    const nouveauVehicule: Vehicule = {
      ...vehicule,
      id: `VEH-${Date.now()}`,
      dateEnregistrement: new Date()
    };
    
    setData(prev => ({
      ...prev,
      vehicules: [...prev.vehicules, nouveauVehicule]
    }));
  };

  const modifierVehicule = (id: string, modifications: Partial<Vehicule>) => {
    setData(prev => ({
      ...prev,
      vehicules: prev.vehicules.map(vehicule =>
        vehicule.id === id ? { ...vehicule, ...modifications } : vehicule
      )
    }));
  };

  const supprimerVehicule = (id: string) => {
    setData(prev => ({
      ...prev,
      vehicules: prev.vehicules.filter(vehicule => vehicule.id !== id)
    }));
  };

  // Propriétaires Management
  const ajouterProprietaire = (proprietaire: Omit<ProprietaireVehicule, 'id' | 'dateCreation'>) => {
    const nouveauProprietaire: ProprietaireVehicule = {
      ...proprietaire,
      id: `PROP-${Date.now()}`,
      dateCreation: new Date()
    };
    
    setData(prev => ({
      ...prev,
      proprietaires: [...prev.proprietaires, nouveauProprietaire]
    }));
  };

  // Contrats Management
  const creerContrat = (contrat: Omit<ContratVehicule, 'id'>) => {
    const nouveauContrat: ContratVehicule = {
      ...contrat,
      id: `CONT-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      contrats: [...prev.contrats, nouveauContrat]
    }));
  };

  const terminerLocation = (contratId: string) => {
    const contrat = data.contrats.find(c => c.id === contratId);
    if (contrat && contrat.type === 'location') {
      // Mettre à jour le contrat
      setData(prev => ({
        ...prev,
        contrats: prev.contrats.map(c =>
          c.id === contratId ? { ...c, statut: 'termine', dateFin: new Date() } : c
        )
      }));

      // Ajouter à l'historique
      const nouvelHistorique: HistoriqueLocation = {
        dateDebut: contrat.dateDebut,
        dateFin: new Date(),
        client: contrat.clientNom,
        montant: contrat.montant,
        kilometrage: contrat.kilometrageDebut
      };

      setData(prev => ({
        ...prev,
        historique: [...prev.historique, nouvelHistorique]
      }));

      // Mettre le véhicule disponible
      setData(prev => ({
        ...prev,
        vehicules: prev.vehicules.map(v =>
          v.id === contrat.vehiculeId ? { ...v, statut: 'disponible' } : v
        )
      }));
    }
  };

  // Statistics
  const obtenirStatistiques = () => {
    const vehiculesTotal = data.vehicules.length;
    const enLocation = data.vehicules.filter(v => v.statut === 'loue').length;
    const disponibles = data.vehicules.filter(v => v.statut === 'disponible').length;
    const contratsMois = data.contrats.filter(c => {
      const maintenant = new Date();
      const dateContrat = new Date(c.dateDebut);
      return dateContrat.getMonth() === maintenant.getMonth() && 
             dateContrat.getFullYear() === maintenant.getFullYear();
    });
    const revenusMensuels = contratsMois.reduce((total, c) => total + c.montant, 0);

    return {
      vehiculesTotal,
      enLocation,
      disponibles,
      revenusMensuels
    };
  };

  const obtenirVehiculesDisponibles = () => {
    return data.vehicules.filter(v => v.statut === 'disponible');
  };

  const obtenirContratsActifs = () => {
    return data.contrats.filter(c => c.statut === 'actif');
  };

  return {
    // Data
    vehicules: data.vehicules,
    proprietaires: data.proprietaires,
    contrats: data.contrats,
    historique: data.historique,
    
    // Methods
    ajouterVehicule,
    modifierVehicule,
    supprimerVehicule,
    ajouterProprietaire,
    creerContrat,
    terminerLocation,
    obtenirStatistiques,
    obtenirVehiculesDisponibles,
    obtenirContratsActifs,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};