
import { useCallback } from 'react';
import { useFademStorage } from './useLocalStorage';
import { 
  ImmobilierData,
  Proprietaire,
  Bien,
  Locataire,
  Contrat,
  AlerteImmobilier,
  StatistiquesImmobilier,
  EcheanceLoyer,
  Paiement
} from '@/types/immobilier-unifie';
import { generateId } from '@/utils/helpers';

const initialData: ImmobilierData = {
  proprietaires: [],
  biens: [],
  locataires: [],
  contrats: [],
  alertes: [],
  echeances: [],
  paiements: [],
  derniereMAJ: new Date(),
  version: '2.0.0'
};

export function useImmobilierUltra() {
  const { data, setData } = useFademStorage('immobilier_ultra', initialData);

  // ============ GESTION DES ÉCHÉANCES AUTOMATIQUES ============
  
  const genererEcheancesContrat = useCallback((contrat: Contrat) => {
    const echeances: EcheanceLoyer[] = [];
    const dateDebut = new Date(contrat.dateDebut);
    const dateFin = contrat.dateFin ? new Date(contrat.dateFin) : new Date(dateDebut.getTime() + contrat.duree * 30 * 24 * 60 * 60 * 1000);
    
    let dateEcheance = new Date(dateDebut);
    dateEcheance.setMonth(dateEcheance.getMonth() + 1); // Premier loyer après 1 mois
    
    while (dateEcheance <= dateFin) {
      echeances.push({
        id: generateId(),
        contratId: contrat.id,
        locataireId: contrat.locataireId,
        bienId: contrat.bienId,
        chambreNumero: contrat.chambreNumero,
        montant: contrat.montantMensuel,
        dateEcheance: new Date(dateEcheance),
        statut: 'en_attente',
        fraisRetard: 0
      });
      
      dateEcheance.setMonth(dateEcheance.getMonth() + 1);
    }
    
    return echeances;
  }, []);

  const verifierRetards = useCallback(() => {
    const aujourdhui = new Date();
    const echeancesEnRetard = data.echeances.filter(e => 
      e.statut === 'en_attente' && new Date(e.dateEcheance) < aujourdhui
    );

    const alertesRetard: AlerteImmobilier[] = [];

    echeancesEnRetard.forEach(echeance => {
      const joursRetard = Math.floor((aujourdhui.getTime() - new Date(echeance.dateEcheance).getTime()) / (1000 * 60 * 60 * 24));
      const locataire = data.locataires.find(l => l.id === echeance.locataireId);
      const bien = data.biens.find(b => b.id === echeance.bienId);
      
      if (locataire && bien) {
        const priorite = joursRetard > 15 ? 'urgente' : joursRetard > 7 ? 'haute' : 'moyenne';
        
        alertesRetard.push({
          id: generateId(),
          type: 'paiement_retard',
          priorite,
          titre: `Retard de paiement - ${joursRetard} jour(s)`,
          description: `${locataire.nom} ${locataire.prenom} - Loyer de ${echeance.montant.toLocaleString()} CFA en retard`,
          locataireId: locataire.id,
          bienId: bien.id,
          chambreNumero: echeance.chambreNumero,
          dateCreation: aujourdhui,
          dateEcheance: new Date(echeance.dateEcheance),
          actions: ['Appeler', 'Envoyer SMS', 'Visite'],
          resolue: false,
          couleur: priorite === 'urgente' ? '#ef4444' : priorite === 'haute' ? '#f59e0b' : '#eab308'
        });
      }
    });

    return alertesRetard;
  }, [data]);

  // ============ ACTIONS PRINCIPALES ============
  
  const ajouterProprietaire = useCallback((proprietaireData: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    const nouveauProprietaire: Proprietaire = {
      ...proprietaireData,
      id: generateId(),
      dateCreation: new Date(),
      biensConfies: [],
      commissionsRecues: 0
    };

    setData(prev => ({
      ...prev,
      proprietaires: [...prev.proprietaires, nouveauProprietaire],
      derniereMAJ: new Date()
    }));

    return nouveauProprietaire;
  }, [setData]);

  const ajouterBien = useCallback((bienData: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission' | 'historiqueOccupation' | 'alertes'>) => {
    const nouveauBien: Bien = {
      ...bienData,
      id: generateId(),
      dateEnregistrement: new Date(),
      statut: 'disponible',
      commission: 0,
      historiqueOccupation: [],
      alertes: []
    };

    setData(prev => ({
      ...prev,
      biens: [...prev.biens, nouveauBien],
      derniereMAJ: new Date()
    }));

    return nouveauBien;
  }, [setData]);

  const ajouterLocataire = useCallback((locataireData: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs' | 'garants' | 'documents' | 'historiqueLogements' | 'statusPaiement' | 'soldeCompte' | 'dateProchainLoyer' | 'montantProchainLoyer'>) => {
    const nouveauLocataire: Locataire = {
      ...locataireData,
      id: generateId(),
      dateCreation: new Date(),
      contratsActifs: [],
      garants: [],
      documents: [],
      historiqueLogements: [],
      statusPaiement: 'a_jour',
      soldeCompte: 0,
      dateProchainLoyer: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      montantProchainLoyer: 0
    };

    setData(prev => ({
      ...prev,
      locataires: [...prev.locataires, nouveauLocataire],
      derniereMAJ: new Date()
    }));

    return nouveauLocataire;
  }, [setData]);

  const creerContrat = useCallback((contratData: Omit<Contrat, 'id' | 'dateSignature' | 'echeances' | 'paiements' | 'factures'>) => {
    const nouveauContrat: Contrat = {
      ...contratData,
      id: generateId(),
      dateSignature: new Date(),
      echeances: [],
      paiements: [],
      factures: []
    };

    // Générer les échéances automatiquement
    const echeances = genererEcheancesContrat(nouveauContrat);

    setData(prev => {
      // Mettre à jour le statut du bien et de la chambre
      const biensMAJ = prev.biens.map(bien => {
        if (bien.id === contratData.bienId) {
          const chambresMAJ = bien.chambres.map(chambre => 
            chambre.numero === contratData.chambreNumero 
              ? { ...chambre, statut: 'occupee' as const, locataireActuel: contratData.locataireId, dateOccupation: new Date() }
              : chambre
          );
          
          const chambresOccupees = chambresMAJ.filter(c => c.statut === 'occupee').length;
          const nouveauStatut = chambresOccupees === 0 ? 'disponible' : 
                               chambresOccupees === chambresMAJ.length ? 'complet' : 'partiellement_loue';
          
          return {
            ...bien,
            statut: nouveauStatut as any,
            contratActuel: nouveauContrat.id,
            chambres: chambresMAJ
          };
        }
        return bien;
      });

      // Mettre à jour le locataire
      const locatairesMAJ = prev.locataires.map(locataire => {
        if (locataire.id === contratData.locataireId) {
          return {
            ...locataire,
            bienActuel: contratData.bienId,
            chambreActuelle: contratData.chambreNumero,
            contratsActifs: [...locataire.contratsActifs, nouveauContrat.id],
            dateProchainLoyer: echeances[0]?.dateEcheance || new Date(),
            montantProchainLoyer: contratData.montantMensuel
          };
        }
        return locataire;
      });

      return {
        ...prev,
        contrats: [...prev.contrats, nouveauContrat],
        echeances: [...prev.echeances, ...echeances],
        biens: biensMAJ,
        locataires: locatairesMAJ,
        derniereMAJ: new Date()
      };
    });

    return nouveauContrat;
  }, [setData, genererEcheancesContrat]);

  const enregistrerPaiement = useCallback((paiementData: Omit<Paiement, 'id'>) => {
    const nouveauPaiement: Paiement = {
      ...paiementData,
      id: generateId()
    };

    setData(prev => {
      // Trouver l'échéance correspondante
      const echeanceIndex = prev.echeances.findIndex(e => e.id === paiementData.echeanceId);
      if (echeanceIndex === -1) return prev;

      const echeance = prev.echeances[echeanceIndex];
      const montantTotal = (echeance.montantPaye || 0) + paiementData.montant;
      
      // Mettre à jour le statut de l'échéance
      const nouveauStatut = montantTotal >= echeance.montant ? 'paye' : 'partiel';
      const echeancesMAJ = [...prev.echeances];
      echeancesMAJ[echeanceIndex] = {
        ...echeance,
        montantPaye: montantTotal,
        statut: nouveauStatut,
        datePaiement: paiementData.datePaiement
      };

      // Mettre à jour le solde du locataire
      const locatairesMAJ = prev.locataires.map(locataire => {
        if (locataire.id === echeance.locataireId) {
          const nouveauSolde = locataire.soldeCompte + paiementData.montant;
          const nouveauStatus = nouveauSolde >= 0 ? 'a_jour' : 
                               nouveauSolde > -echeance.montant ? 'retard_leger' : 'retard_important';
          
          return {
            ...locataire,
            soldeCompte: nouveauSolde,
            statusPaiement: nouveauStatus
          };
        }
        return locataire;
      });

      return {
        ...prev,
        paiements: [...prev.paiements, nouveauPaiement],
        echeances: echeancesMAJ,
        locataires: locatairesMAJ,
        derniereMAJ: new Date()
      };
    });

    return nouveauPaiement;
  }, [setData]);

  // ============ STATISTIQUES TEMPS RÉEL ============
  
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
    const chambresReservees = data.biens.reduce((sum, bien) => 
      sum + bien.chambres.filter(c => c.statut === 'reservee').length, 0
    );

    const tauxOccupation = totalChambres > 0 ? (chambresOccupees / totalChambres) * 100 : 0;

    // Calculs financiers
    const revenusMensuel = data.contrats
      .filter(c => c.statut === 'actif')
      .reduce((sum, c) => sum + c.montantMensuel, 0);

    const paiementsEncaisses = data.paiements
      .filter(p => {
        const date = new Date(p.datePaiement);
        const maintenant = new Date();
        return date.getMonth() === maintenant.getMonth() && date.getFullYear() === maintenant.getFullYear();
      })
      .reduce((sum, p) => sum + p.montant, 0);

    const echeancesEnAttente = data.echeances
      .filter(e => e.statut === 'en_attente')
      .reduce((sum, e) => sum + e.montant, 0);

    const locatairesEnRetard = data.locataires.filter(l => 
      l.statusPaiement === 'retard_leger' || l.statusPaiement === 'retard_important'
    );
    const montantRetards = locatairesEnRetard.reduce((sum, l) => sum + Math.abs(l.soldeCompte), 0);

    // Alertes
    const alertesNonResolues = data.alertes.filter(a => !a.resolue).length;
    const contratsExpirant = data.contrats.filter(c => {
      if (!c.dateFin) return false;
      const dans30Jours = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return new Date(c.dateFin) <= dans30Jours && c.statut === 'actif';
    }).length;

    const paiementsEnRetard = data.echeances.filter(e => 
      e.statut !== 'paye' && new Date(e.dateEcheance) < new Date()
    ).length;

    return {
      tauxOccupation,
      chambresLibres,
      chambresOccupees,
      chambresMaintenace,
      chambresReservees,
      revenus: {
        mensuel: revenusMensuel,
        annuel: revenusMensuel * 12,
        previsionnel: (revenusMensuel / totalChambres) * totalChambres * 12,
        encaisse: paiementsEncaisses,
        enAttente: echeancesEnAttente
      },
      retards: {
        montant: montantRetards,
        nombreLocataires: locatairesEnRetard.length,
        montantFrais: data.echeances.reduce((sum, e) => sum + e.fraisRetard, 0)
      },
      contratsExpirant,
      paiementsEnRetard,
      maintenancePrevue: chambresMaintenace,
      alertesNonResolues,
      rotationLocataires: 0, // À calculer
      tempsOccupationMoyen: 0, // À calculer
      satisfactionMoyenne: 0 // À implémenter
    };
  }, [data]);

  // Mise à jour automatique des alertes
  const mettreAJourAlertes = useCallback(() => {
    const nouvellesAlertes = verifierRetards();
    
    setData(prev => ({
      ...prev,
      alertes: [
        ...prev.alertes.filter(a => a.resolue || a.type !== 'paiement_retard'),
        ...nouvellesAlertes
      ],
      derniereMAJ: new Date()
    }));
  }, [verifierRetards, setData]);

  return {
    // Données
    data,
    proprietaires: data.proprietaires,
    biens: data.biens,
    locataires: data.locataires,
    contrats: data.contrats,
    alertes: data.alertes,
    echeances: data.echeances,
    paiements: data.paiements,

    // Actions principales
    ajouterProprietaire,
    ajouterBien,
    ajouterLocataire,
    creerContrat,
    enregistrerPaiement,

    // Gestion automatique
    genererEcheancesContrat,
    verifierRetards,
    mettreAJourAlertes,

    // Utilitaires
    obtenirStatistiques
  };
}
