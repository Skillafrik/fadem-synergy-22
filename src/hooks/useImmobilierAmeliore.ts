
import { useCallback } from 'react';
import { useFademStorage } from './useLocalStorage';
import { 
  LocataireAmeliore, 
  BienAmeliore, 
  ContratAmeliore, 
  AlerteImmobilier, 
  StatistiquesImmobilier 
} from '@/types/immobilier';
import { generateId } from '@/utils/helpers';

interface ImmobilierDataAmeliore {
  locataires: LocataireAmeliore[];
  biens: BienAmeliore[];
  contrats: ContratAmeliore[];
  alertes: AlerteImmobilier[];
}

const initialData: ImmobilierDataAmeliore = {
  locataires: [],
  biens: [],
  contrats: [],
  alertes: []
};

export function useImmobilierAmeliore() {
  const { data, setData } = useFademStorage('immobilier_ameliore', initialData);

  // Locataires
  const ajouterLocataire = useCallback((locataireData: Omit<LocataireAmeliore, 'id' | 'dateCreation' | 'contratsActifs' | 'historiqueLogements' | 'documents' | 'garants'>) => {
    const nouveauLocataire: LocataireAmeliore = {
      ...locataireData,
      id: generateId(),
      dateCreation: new Date(),
      contratsActifs: [],
      historiqueLogements: [],
      documents: [],
      garants: [],
      statusPaiement: 'a_jour',
      soldeCompte: 0,
      dateProchainLoyer: new Date(),
      montantProchainLoyer: 0,
      contactPreference: 'telephone',
      languePreferee: 'francais'
    };

    setData(prev => ({
      ...prev,
      locataires: [...prev.locataires, nouveauLocataire]
    }));

    return nouveauLocataire;
  }, [setData]);

  const modifierLocataire = useCallback((id: string, updates: Partial<LocataireAmeliore>) => {
    setData(prev => ({
      ...prev,
      locataires: prev.locataires.map(l => 
        l.id === id ? { ...l, ...updates } : l
      )
    }));
  }, [setData]);

  // Biens
  const ajouterBien = useCallback((bienData: Omit<BienAmeliore, 'id' | 'dateEnregistrement' | 'statut' | 'commission' | 'historiqueOccupation'>) => {
    const nouveauBien: BienAmeliore = {
      ...bienData,
      id: generateId(),
      dateEnregistrement: new Date(),
      statut: 'disponible',
      commission: 0,
      historiqueOccupation: []
    };

    setData(prev => ({
      ...prev,
      biens: [...prev.biens, nouveauBien]
    }));

    return nouveauBien;
  }, [setData]);

  // Contrats
  const creerContrat = useCallback((contratData: Omit<ContratAmeliore, 'id' | 'dateSignature' | 'paiements' | 'factures'>) => {
    const nouveauContrat: ContratAmeliore = {
      ...contratData,
      id: generateId(),
      dateSignature: new Date(),
      paiements: [],
      factures: [],
      clausesPersonnalisees: contratData.clausesPersonnalisees || [],
      inventaire: contratData.inventaire || { mobilier: [], electromenager: [], autres: [] },
      etatDesLieux: {},
      penalitesRetard: 2, // 2% par défaut
      renouvellementAuto: false
    };

    // Mettre à jour le statut du bien et de la chambre
    setData(prev => ({
      ...prev,
      contrats: [...prev.contrats, nouveauContrat],
      biens: prev.biens.map(bien => {
        if (bien.id === contratData.bienId) {
          return {
            ...bien,
            statut: 'loue',
            contratActuel: nouveauContrat.id,
            chambres: bien.chambres.map(chambre => 
              chambre.numero === contratData.chambreNumero 
                ? { ...chambre, statut: 'occupee', locataireActuel: contratData.locataireId }
                : chambre
            )
          };
        }
        return bien;
      }),
      locataires: prev.locataires.map(locataire => {
        if (locataire.id === contratData.locataireId) {
          return {
            ...locataire,
            bienActuel: contratData.bienId,
            chambreActuelle: contratData.chambreNumero,
            contratsActifs: [...locataire.contratsActifs, nouveauContrat.id],
            dateProchainLoyer: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
            montantProchainLoyer: contratData.montantMensuel
          };
        }
        return locataire;
      })
    }));

    return nouveauContrat;
  }, [setData]);

  // Alertes
  const creerAlerte = useCallback((alerteData: Omit<AlerteImmobilier, 'id' | 'dateCreation' | 'resolue'>) => {
    const nouvelleAlerte: AlerteImmobilier = {
      ...alerteData,
      id: generateId(),
      dateCreation: new Date(),
      resolue: false
    };

    setData(prev => ({
      ...prev,
      alertes: [...prev.alertes, nouvelleAlerte]
    }));

    return nouvelleAlerte;
  }, [setData]);

  const resoudreAlerte = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      alertes: prev.alertes.map(alerte => 
        alerte.id === id ? { ...alerte, resolue: true } : alerte
      )
    }));
  }, [setData]);

  // Statistiques
  const obtenirStatistiques = useCallback((): StatistiquesImmobilier => {
    const totalChambres = data.biens.reduce((sum, bien) => sum + bien.chambres.length, 0);
    const chambresOccupees = data.biens.reduce((sum, bien) => 
      sum + bien.chambres.filter(c => c.statut === 'occupee').length, 0
    );
    const chambresLibres = data.biens.reduce((sum, bien) => 
      sum + bien.chambres.filter(c => c.statut === 'libre').length, 0
    );
    const chambresMaintenace = data.biens.reduce((sum, bien) => 
      sum + bien.chambres.filter(c => c.statut === 'maintenance').length, 0
    );

    const tauxOccupation = totalChambres > 0 ? (chambresOccupees / totalChambres) * 100 : 0;

    const revenusMensuel = data.biens.reduce((sum, bien) => 
      sum + bien.chambres.filter(c => c.statut === 'occupee').reduce((s, c) => s + c.prix, 0), 0
    );

    const locatairesEnRetard = data.locataires.filter(l => 
      l.statusPaiement === 'retard_leger' || l.statusPaiement === 'retard_important'
    );
    const montantRetards = locatairesEnRetard.reduce((sum, l) => sum + Math.abs(l.soldeCompte), 0);

    const contratsExpirant = data.contrats.filter(c => {
      if (!c.dateFin) return false;
      const dans30Jours = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return new Date(c.dateFin) <= dans30Jours;
    }).length;

    return {
      tauxOccupation,
      chambresLibres,
      chambresOccupees,
      chambresMaintenace,
      revenus: {
        mensuel: revenusMensuel,
        annuel: revenusMensuel * 12,
        previsionnel: (revenusMensuel / totalChambres) * totalChambres * 12 // Si 100% occupé
      },
      retards: {
        montant: montantRetards,
        nombreLocataires: locatairesEnRetard.length
      },
      contratsExpirant,
      paiementsAttendus: data.locataires.filter(l => l.statusPaiement !== 'a_jour').length,
      maintenancePrevue: chambresMaintenace
    };
  }, [data]);

  return {
    // Données
    locataires: data.locataires,
    biens: data.biens,
    contrats: data.contrats,
    alertes: data.alertes,

    // Actions Locataires
    ajouterLocataire,
    modifierLocataire,

    // Actions Biens
    ajouterBien,

    // Actions Contrats
    creerContrat,

    // Actions Alertes
    creerAlerte,
    resoudreAlerte,

    // Utilitaires
    obtenirStatistiques
  };
}
