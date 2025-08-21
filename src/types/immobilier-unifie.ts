
// Types unifiés et cohérents pour le module immobilier ultra-moderne

export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface Chambre {
  numero: string;
  superficie: number;
  prix: number;
  equipements: string[];
  photos: string[];
  statut: 'libre' | 'occupee' | 'maintenance' | 'reservee';
  locataireActuel?: string;
  dateOccupation?: Date;
  niveau: number;
  description?: string;
}

export interface Garant {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  profession: string;
  adresse: string;
  relation: string;
  revenus?: number;
  dateEnregistrement: Date;
}

export interface DocumentLocataire {
  id: string;
  type: 'cni' | 'passeport' | 'fiche_paie' | 'contrat_travail' | 'photo' | 'caution' | 'autre';
  nom: string;
  url?: string;
  dateAjout: Date;
  validite?: Date;
  statut: 'valide' | 'expire' | 'en_attente';
}

export interface Proprietaire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  dateCreation: Date;
  biensConfies: string[];
  contactPreference: 'telephone' | 'email' | 'whatsapp';
  comptesBancaires: string[];
  notesPrivees?: string;
  commissionsRecues: number;
}

export interface Bien {
  id: string;
  proprietaireId: string;
  type: 'appartement' | 'maison' | 'studio' | 'bureau' | 'commerce';
  nom: string;
  adresse: string;
  quartier: string;
  ville: string;
  superficie: number;
  nbrChambres: number;
  chambres: Chambre[];
  etages: number;
  prixFadem: number;
  commission: number;
  statut: 'disponible' | 'partiellement_loue' | 'complet' | 'maintenance';
  dateEnregistrement: Date;
  contratActuel?: string;
  description?: string;
  equipements: string[];
  photos: {
    facade: string[];
    chambres: Record<string, string[]>;
    communs: string[];
  };
  coordonnees?: Coordonnees;
  historiqueOccupation: HistoriqueLogement[];
  alertes: string[];
}

export interface HistoriqueLogement {
  id: string;
  bienId: string;
  chambreNumero?: string;
  locataireId: string;
  dateEntree: Date;
  dateSortie?: Date;
  montantLoyer: number;
  motifSortie?: string;
  etatEntree?: string;
  etatSortie?: string;
}

export interface Locataire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  profession: string;
  entreprise?: string;
  cni: string;
  passeport?: string;
  dateNaissance: Date;
  situationMatrimoniale: 'celibataire' | 'marie' | 'divorce' | 'veuf';
  personnesACharge: number;
  revenus?: number;
  dateCreation: Date;
  
  // Localisation actuelle
  bienActuel?: string;
  chambreActuelle?: string;
  contratsActifs: string[];
  
  // Documents et garants
  garants: Garant[];
  documents: DocumentLocataire[];
  historiqueLogements: HistoriqueLogement[];
  
  // Statut financier
  statusPaiement: 'a_jour' | 'retard_leger' | 'retard_important' | 'impaye';
  soldeCompte: number;
  dateProchainLoyer: Date;
  montantProchainLoyer: number;
  
  // Préférences
  contactPreference: 'telephone' | 'email' | 'whatsapp' | 'visite';
  languePreferee: 'francais' | 'anglais' | 'local';
  notesPrivees?: string;
}

export interface EcheanceLoyer {
  id: string;
  contratId: string;
  locataireId: string;
  bienId: string;
  chambreNumero?: string;
  montant: number;
  dateEcheance: Date;
  datePaiement?: Date;
  statut: 'en_attente' | 'paye' | 'retard' | 'partiel';
  montantPaye?: number;
  fraisRetard: number;
  methode?: 'espece' | 'virement' | 'cheque' | 'mobile_money';
  reference?: string;
  notes?: string;
}

export interface Paiement {
  id: string;
  echeanceId: string;
  montant: number;
  datePaiement: Date;
  methode: 'espece' | 'virement' | 'cheque' | 'mobile_money';
  reference?: string;
  fraisSupplementaires: {
    electricite?: number;
    eau?: number;
    internet?: number;
    menage?: number;
    autres?: Record<string, number>;
  };
  recu?: string;
  notes?: string;
}

export interface Contrat {
  id: string;
  proprietaireId: string;
  bienId: string;
  locataireId: string;
  chambreNumero?: string;
  type: 'location' | 'vente';
  dateDebut: Date;
  dateFin?: Date;
  duree: number;
  montantMensuel: number;
  caution: number;
  avance?: number;
  statut: 'actif' | 'suspendu' | 'resilié' | 'expire';
  dateSignature: Date;
  
  // Clauses et inventaire
  clausesPersonnalisees: string[];
  inventaire: {
    mobilier: string[];
    electromenager: string[];
    autres: string[];
  };
  etatDesLieux: {
    entree?: string;
    sortie?: string;
  };
  
  // Gestion automatique
  penalitesRetard: number;
  renouvellementAuto: boolean;
  preavisRecu?: Date;
  motifResiliation?: string;
  
  // Paiements et factures
  echeances: EcheanceLoyer[];
  paiements: Paiement[];
  factures: string[];
}

export interface AlerteImmobilier {
  id: string;
  type: 'paiement_retard' | 'contrat_expiration' | 'maintenance_requise' | 'visite_prevue' | 'document_expire';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  titre: string;
  description: string;
  locataireId?: string;
  bienId?: string;
  chambreNumero?: string;
  contratId?: string;
  dateCreation: Date;
  dateEcheance: Date;
  actions: string[];
  resolue: boolean;
  dateResolution?: Date;
  couleur: string;
}

export interface StatistiquesImmobilier {
  // Occupation
  tauxOccupation: number;
  chambresLibres: number;
  chambresOccupees: number;
  chambresMaintenace: number;
  chambresReservees: number;
  
  // Financier temps réel
  revenus: {
    mensuel: number;
    annuel: number;
    previsionnel: number;
    encaisse: number;
    enAttente: number;
  };
  retards: {
    montant: number;
    nombreLocataires: number;
    montantFrais: number;
  };
  
  // Alertes et échéances
  contratsExpirant: number;
  paiementsEnRetard: number;
  maintenancePrevue: number;
  alertesNonResolues: number;
  
  // Performance
  rotationLocataires: number;
  tempsOccupationMoyen: number;
  satisfactionMoyenne: number;
}

export interface ImmobilierData {
  proprietaires: Proprietaire[];
  biens: Bien[];
  locataires: Locataire[];
  contrats: Contrat[];
  alertes: AlerteImmobilier[];
  echeances: EcheanceLoyer[];
  paiements: Paiement[];
  derniereMAJ: Date;
  version: string;
}
