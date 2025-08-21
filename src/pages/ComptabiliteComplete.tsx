
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useComptabiliteComplete } from '@/hooks/useComptabiliteComplete';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { CompteForm } from '@/components/forms/CompteForm';
import { TransactionComptableComplete, Compte } from '@/types/comptabilite';
import { 
  Plus, 
  PiggyBank, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react';

export default function ComptabiliteComplete() {
  const {
    transactions,
    comptes,
    categories,
    ajouterCompte,
    modifierCompte,
    supprimerCompte,
    ajouterTransaction,
    modifierTransaction,
    supprimerTransaction,
    obtenirStatistiques,
    obtenirBilansComptes,
    exportData,
    importData,
    removeData
  } = useComptabiliteComplete();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionComptableComplete | null>(null);
  const [editingCompte, setEditingCompte] = useState<Compte | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompte, setSelectedCompte] = useState('all');

  const stats = obtenirStatistiques();
  const bilansComptes = obtenirBilansComptes();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.tiers?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.numeroTransaction?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompte = selectedCompte === 'all' || transaction.compteId === selectedCompte;
    
    return matchesSearch && matchesCompte;
  });

  const handleSubmitTransaction = (data: Omit<TransactionComptableComplete, 'id'>) => {
    try {
      if (editingTransaction) {
        modifierTransaction(editingTransaction.id, data);
      } else {
        ajouterTransaction(data);
      }
      setShowTransactionForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleSubmitCompte = (data: Omit<Compte, 'id' | 'dateOuverture' | 'soldeActuel'>) => {
    try {
      if (editingCompte) {
        modifierCompte(editingCompte.id, data);
      } else {
        ajouterCompte(data);
      }
      setShowCompteForm(false);
      setEditingCompte(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEditTransaction = (transaction: TransactionComptableComplete) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleEditCompte = (compte: Compte) => {
    setEditingCompte(compte);
    setShowCompteForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      supprimerTransaction(id);
    }
  };

  const handleDeleteCompte = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        supprimerCompte(id);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fadem-comptabilite-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          alert('Données importées avec succès !');
        } catch (error) {
          alert('Erreur lors de l\'import des données');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      removeData();
      alert('Données supprimées avec succès !');
    }
  };

  if (showTransactionForm) {
    return (
      <TransactionForm
        transaction={editingTransaction || undefined}
        comptes={comptes}
        categories={categories}
        onSubmit={handleSubmitTransaction}
        onCancel={() => {
          setShowTransactionForm(false);
          setEditingTransaction(null);
        }}
      />
    );
  }

  if (showCompteForm) {
    return (
      <CompteForm
        compte={editingCompte || undefined}
        onSubmit={handleSubmitCompte}
        onCancel={() => {
          setShowCompteForm(false);
          setEditingCompte(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-fadem-black">Comptabilité Complète</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
          >
            Remettre à zéro
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="comptes">Comptes</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus du jour</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.revenusJour.toLocaleString()} CFA
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dépenses du jour</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.depensesJour.toLocaleString()} CFA
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bénéfice net</p>
                  <p className={`text-2xl font-bold ${stats.beneficesNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.beneficesNet.toLocaleString()} CFA
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solde total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.soldeTotal.toLocaleString()} CFA
                  </p>
                </div>
                <PiggyBank className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => setShowTransactionForm(true)} 
                  className="w-full bg-fadem-red hover:bg-fadem-red-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Transaction
                </Button>
                <Button 
                  onClick={() => setShowCompteForm(true)} 
                  variant="outline" 
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Compte
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Résumé mensuel</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenus:</span>
                  <span className="text-green-600 font-semibold">
                    {stats.revenusMois.toLocaleString()} CFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Dépenses:</span>
                  <span className="text-red-600 font-semibold">
                    {stats.depensesMois.toLocaleString()} CFA
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Marge nette:</span>
                  <span className={`font-semibold ${stats.margeNette >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.margeNette}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Transactions récentes</h3>
            <div className="space-y-2">
              {transactions.slice(-5).reverse().map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.tiers} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'recette' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'recette' ? '+' : '-'}{transaction.montant.toLocaleString()} CFA
                    </p>
                    <Badge variant={transaction.statut === 'validee' ? 'default' : 'secondary'}>
                      {transaction.statut}
                    </Badge>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-gray-500 py-8">Aucune transaction enregistrée</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion des Transactions</h2>
            <Button 
              onClick={() => setShowTransactionForm(true)}
              className="bg-fadem-red hover:bg-fadem-red-dark"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Transaction
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCompte}
              onChange={(e) => setSelectedCompte(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tous les comptes</option>
              {comptes.map((compte) => (
                <option key={compte.id} value={compte.id}>
                  {compte.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{transaction.description}</h4>
                      <Badge variant={transaction.type === 'recette' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                      <Badge variant={transaction.statut === 'validee' ? 'default' : 'secondary'}>
                        {transaction.statut}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Compte: {comptes.find(c => c.id === transaction.compteId)?.nom}</p>
                      <p>Tiers: {transaction.tiers}</p>
                      <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                      <p>Mode: {transaction.modePaiement}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'recette' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'recette' ? '+' : '-'}{transaction.montant.toLocaleString()} CFA
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredTransactions.length === 0 && (
              <Card className="p-8">
                <p className="text-center text-gray-500">Aucune transaction trouvée</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comptes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion des Comptes</h2>
            <Button 
              onClick={() => setShowCompteForm(true)}
              className="bg-fadem-red hover:bg-fadem-red-dark"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Compte
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comptes.map((compte) => (
              <Card key={compte.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{compte.nom}</h4>
                    <Badge variant={compte.statut === 'actif' ? 'default' : 'secondary'}>
                      {compte.statut}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Type: {compte.type}</p>
                    {compte.numero && <p>N°: {compte.numero}</p>}
                    {compte.banque && <p>Banque: {compte.banque}</p>}
                    <p>Devise: {compte.devise}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-lg font-bold text-blue-600">
                      {compte.soldeActuel.toLocaleString()} {compte.devise}
                    </p>
                    <p className="text-xs text-gray-500">
                      Solde initial: {compte.soldeInitial.toLocaleString()} {compte.devise}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCompte(compte)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCompte(compte.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {comptes.length === 0 && (
              <Card className="p-8 col-span-full">
                <p className="text-center text-gray-500">Aucun compte créé</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rapports" className="space-y-4">
          <h2 className="text-xl font-semibold">Rapports et Analyses</h2>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Bilan par compte (mois actuel)</h3>
            <div className="space-y-3">
              {bilansComptes.map((bilan) => (
                <div key={bilan.compteId} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{bilan.nomCompte}</h4>
                    <Badge>{bilan.nombreTransactions} transactions</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Solde début</p>
                      <p className="font-semibold">{bilan.soldeDebut.toLocaleString()} CFA</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Recettes</p>
                      <p className="font-semibold text-green-600">+{bilan.totalRecettes.toLocaleString()} CFA</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dépenses</p>
                      <p className="font-semibold text-red-600">-{bilan.totalDepenses.toLocaleString()} CFA</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Solde fin</p>
                      <p className="font-semibold">{bilan.soldeFin.toLocaleString()} CFA</p>
                    </div>
                  </div>
                </div>
              ))}
              {bilansComptes.length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucun compte pour générer des bilans</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
