
// Types spécifiques à la comptabilité
export interface Compte {
  id: string;
  nom: string;
  type: 'banque' | 'caisse' | 'mobile_money';
  numeroCompte?: string;
  banque?: string;
  soldeInitial: number;
  soldeActuel: number;
  dateOuverture: Date;
  statut: 'actif' | 'inactif' | 'clos';
}

export interface CategorieTransaction {
  id: string;
  nom: string;
  type: 'recette' | 'depense';
  couleur: string;
  description?: string;
  sousCategories?: string[];
}

export interface TransactionComptableComplete {
  id: string;
  compteId: string;
  date: Date;
  type: 'recette' | 'depense';
  montant: number;
  categorieId: string;
  sousCategorieId?: string;
  module: 'immobilier' | 'btp' | 'vehicules' | 'personnel' | 'autre';
  referenceId?: string;
  description: string;
  modePaiement: 'tmoney' | 'moovmoney' | 'especes' | 'virement' | 'cheque';
  numeroTransaction?: string;
  statut: 'validee' | 'en_attente' | 'annulee';
  pieceJustificative?: string;
  tiers?: string;
  remarques?: string;
}

export interface BilanCompte {
  compteId: string;
  nomCompte: string;
  soldeDebut: number;
  totalRecettes: number;
  totalDepenses: number;
  soldeFin: number;
  nombreTransactions: number;
}
