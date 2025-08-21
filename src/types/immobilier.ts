
// Types améliorés pour le module immobilier

export interface Chambre {
  numero: string;
  superficie: number;
  prix: number;
  equipements: string[];
  photos?: string[];
  statut: 'libre' | 'occupee' | 'maintenance' | 'reservee';
  locataireActuel?: string; // ID du locataire
}

export interface Garant {
  nom: string;
  prenom: string;
  telephone: string;
  profession: string;
  adresse: string;
  relation: string; // parent, ami, collègue, etc.
}

export interface DocumentLocataire {
  type: 'cni' | 'fiche_paie' | 'contrat_travail' | 'photo' | 'autre';
  nom: string;
  url?: string;
  dateAjout: Date;
}

export interface HistoriqueLogement {
  bienId: string;
  chambreNumero?: string;
  dateEntree: Date;
  dateSortie?: Date;
  montantLoyer: number;
}

export interface ProprietaireAmeliore extends Omit<import('@/types').Proprietaire, 'biensConfies'> {
  biensConfies: BienAmeliore[];
  contactPreference: 'telephone' | 'email' | 'whatsapp';
  comptesBancaires?: string[];
  notesPrivees?: string;
}

export interface BienAmeliore extends Omit<import('@/types').Bien, 'chambres' | 'photos'> {
  chambres: Chambre[];
  etages: number;
  ascenseur: boolean;
  parking: boolean;
  jardin: boolean;
  piscine: boolean;
  gardien: boolean;
  photos: {
    facade: string[];
    chambres: Record<string, string[]>; // numero chambre -> photos
    communs: string[];
  };
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  historiqueOccupation: HistoriqueLogement[];
}

export interface LocataireAmeliore extends Omit<import('@/types').Locataire, 'contratsActifs'> {
  bienActuel?: string; // ID du bien où il habite
  chambreActuelle?: string; // Numéro de la chambre
  garants: Garant[];
  documents: DocumentLocataire[];
  historiqueLogements: HistoriqueLogement[];
  statusPaiement: 'a_jour' | 'retard_leger' | 'retard_important' | 'impaye';
  soldeCompte: number; // négatif si en retard, positif si avance
  dateProchainLoyer: Date;
  montantProchainLoyer: number;
  notesPrivees?: string;
  contactPreference: 'telephone' | 'email' | 'whatsapp' | 'visite';
  languePreferee: 'francais' | 'anglais' | 'local';
}

export interface ContratAmeliore extends Omit<import('@/types').Contrat, 'paiements' | 'factures'> {
  chambreNumero?: string; // Chambre spécifique dans le bien
  clausesPersonnalisees: string[];
  inventaire: {
    mobilier: string[];
    electromenager: string[];
    autres: string[];
  };
  etatDesLieux: {
    entree?: string; // URL du document
    sortie?: string; // URL du document
  };
  penalitesRetard: number; // pourcentage par jour
  paiements: PaiementAmeliore[];
  factures: string[];
  renouvellementAuto: boolean;
  preavisRecu?: Date;
  motifResiliation?: string;
}

export interface PaiementAmeliore extends import('@/types').Paiement {
  chambreNumero?: string;
  fraisSupplementaires?: {
    electricite?: number;
    eau?: number;
    internet?: number;
    menage?: number;
    autres?: Record<string, number>;
  };
  rappelsEnvoyes: Date[];
  methodePaiementDetails?: {
    numeroTransaction?: string;
    nomPayeur?: string;
    banque?: string;
  };
}

export interface StatistiquesImmobilier {
  // Occupations
  tauxOccupation: number;
  chambresLibres: number;
  chambresOccupees: number;
  chambresMaintenace: number;
  
  // Financier
  revenus: {
    mensuel: number;
    annuel: number;
    previsionnel: number;
  };
  retards: {
    montant: number;
    nombreLocataires: number;
  };
  
  // Alertes
  contratsExpirant: number;
  paiementsAttendus: number;
  maintenancePrevue: number;
}

export interface AlerteImmobilier {
  id: string;
  type: 'paiement_retard' | 'contrat_expiration' | 'maintenance_requise' | 'visite_prevue';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  titre: string;
  description: string;
  locataireId?: string;
  bienId?: string;
  chambreNumero?: string;
  dateEcheance: Date;
  actions: string[];
  resolue: boolean;
  dateCreation: Date;
}
