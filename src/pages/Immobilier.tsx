import { useState } from 'react';
import { Building, Plus, Users, Home, CreditCard, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImmobilier } from '@/hooks/useImmobilier';
import { ProprietaireForm } from '@/components/forms/ProprietaireForm';
import { BienForm } from '@/components/forms/BienForm';
import { LocataireForm } from '@/components/forms/LocataireForm';
import { ContratForm } from '@/components/forms/ContratForm';
import { ProprietairesTable } from '@/components/tables/ProprietairesTable';
import { Proprietaire, Bien, Locataire, Contrat } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';

const Immobilier = () => {
  const {
    proprietaires,
    biens,
    locataires,
    contrats,
    ajouterProprietaire,
    modifierProprietaire,
    supprimerProprietaire,
    ajouterBien,
    modifierBien,
    supprimerBien,
    ajouterLocataire,
    modifierLocataire,
    supprimerLocataire,
    creerContrat,
    modifierContrat,
    resilierContrat,
    obtenirStatistiques
  } = useImmobilier();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showBienForm, setShowBienForm] = useState(false);
  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [showContratForm, setShowContratForm] = useState(false);
  const [editingProprietaire, setEditingProprietaire] = useState<Proprietaire | null>(null);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);
  const [editingLocataire, setEditingLocataire] = useState<Locataire | null>(null);
  const [editingContrat, setEditingContrat] = useState<Contrat | null>(null);

  const stats = obtenirStatistiques();

  const handleAddProprietaire = (data: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    try {
      ajouterProprietaire(data);
      setShowProprietaireForm(false);
      toast.success('Propriétaire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du propriétaire');
    }
  };

  const handleEditProprietaire = (proprietaire: Proprietaire) => {
    setEditingProprietaire(proprietaire);
    setShowProprietaireForm(true);
  };

  const handleUpdateProprietaire = (data: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    if (!editingProprietaire) return;
    
    try {
      modifierProprietaire(editingProprietaire.id, data);
      setShowProprietaireForm(false);
      setEditingProprietaire(null);
      toast.success('Propriétaire modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteProprietaire = (id: string) => {
    try {
      supprimerProprietaire(id);
      toast.success('Propriétaire supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddBien = (data: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    try {
      ajouterBien(data);
      setShowBienForm(false);
      toast.success('Bien ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du bien');
    }
  };

  const handleEditBien = (bien: Bien) => {
    setEditingBien(bien);
    setShowBienForm(true);
  };

  const handleUpdateBien = (data: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    if (!editingBien) return;
    
    try {
      modifierBien(editingBien.id, data);
      setShowBienForm(false);
      setEditingBien(null);
      toast.success('Bien modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteBien = (id: string) => {
    try {
      supprimerBien(id);
      toast.success('Bien supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddLocataire = (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => {
    try {
      ajouterLocataire(data);
      setShowLocataireForm(false);
      toast.success('Locataire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du locataire');
    }
  };

  const handleEditLocataire = (locataire: Locataire) => {
    setEditingLocataire(locataire);
    setShowLocataireForm(true);
  };

  const handleUpdateLocataire = (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => {
    if (!editingLocataire) return;
    
    try {
      modifierLocataire(editingLocataire.id, data);
      setShowLocataireForm(false);
      setEditingLocataire(null);
      toast.success('Locataire modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteLocataire = (id: string) => {
    try {
      supprimerLocataire(id);
      toast.success('Locataire supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddContrat = (data: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures'>) => {
    try {
      creerContrat(data);
      setShowContratForm(false);
      toast.success('Contrat créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du contrat');
    }
  };

  const handleEditContrat = (contrat: Contrat) => {
    setEditingContrat(contrat);
    setShowContratForm(true);
  };

  const handleUpdateContrat = (data: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures'>) => {
    if (!editingContrat) return;
    
    try {
      modifierContrat(editingContrat.id, data);
      setShowContratForm(false);
      setEditingContrat(null);
      toast.success('Contrat modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleResilierContrat = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir résilier ce contrat ?')) {
      try {
        resilierContrat(id);
        toast.success('Contrat résilié avec succès');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const cancelForms = () => {
    setShowProprietaireForm(false);
    setShowBienForm(false);
    setShowLocataireForm(false);
    setShowContratForm(false);
    setEditingProprietaire(null);
    setEditingBien(null);
    setEditingLocataire(null);
    setEditingContrat(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Building size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Immobilier</h1>
            <p className="text-muted-foreground">Gestion des biens, locataires et propriétaires</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              setActiveTab('locataires');
              setShowLocataireForm(true);
            }}
          >
            <UserPlus size={20} className="mr-2" />
            Nouveau Locataire
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setActiveTab('proprietaires');
              setShowProprietaireForm(true);
            }}
          >
            <Users size={20} className="mr-2" />
            Nouveau Propriétaire
          </Button>
          <Button 
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
            onClick={() => {
              setActiveTab('biens');
              setShowBienForm(true);
            }}
          >
            <Plus size={20} className="mr-2" />
            Nouveau Bien
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('proprietaires')}>
          <h3 className="font-semibold text-fadem-black">Propriétaires</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.proprietaires}</p>
          <p className="text-sm text-muted-foreground">Actifs</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('biens')}>
          <h3 className="font-semibold text-fadem-black">Biens</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.biensTotal}</p>
          <p className="text-sm text-muted-foreground">En gestion</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('locataires')}>
          <h3 className="font-semibold text-fadem-black">Locataires</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.locataires}</p>
          <p className="text-sm text-muted-foreground">Enregistrés</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('contrats')}>
          <h3 className="font-semibold text-fadem-black">Contrats Actifs</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.contratsActifs}</p>
          <p className="text-sm text-muted-foreground">En cours</p>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">
            <Building size={16} className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="proprietaires">
            <Users size={16} className="mr-2" />
            Propriétaires
          </TabsTrigger>
          <TabsTrigger value="biens">
            <Home size={16} className="mr-2" />
            Biens
          </TabsTrigger>
          <TabsTrigger value="locataires">
            <UserPlus size={16} className="mr-2" />
            Locataires
          </TabsTrigger>
          <TabsTrigger value="contrats">
            <CreditCard size={16} className="mr-2" />
            Contrats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Statistiques Détaillées</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biens disponibles</span>
                  <span className="font-semibold text-success">{stats.biensDisponibles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biens loués</span>
                  <span className="font-semibold text-warning">{stats.biensLoues}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrats actifs</span>
                  <span className="font-semibold text-fadem-red">{stats.contratsActifs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux d'occupation</span>
                  <span className="font-semibold text-fadem-black">
                    {stats.biensTotal > 0 ? Math.round((stats.biensLoues / stats.biensTotal) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Actions Rapides</h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('proprietaires');
                    setShowProprietaireForm(true);
                  }}
                >
                  <Users size={16} className="mr-2" />
                  Ajouter un propriétaire
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('biens');
                    setShowBienForm(true);
                  }}
                >
                  <Home size={16} className="mr-2" />
                  Enregistrer un bien
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('locataires');
                    setShowLocataireForm(true);
                  }}
                >
                  <UserPlus size={16} className="mr-2" />
                  Ajouter un locataire
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('contrats');
                    setShowContratForm(true);
                  }}
                >
                  <CreditCard size={16} className="mr-2" />
                  Créer un contrat
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proprietaires" className="space-y-6">
          {showProprietaireForm ? (
            <ProprietaireForm
              proprietaire={editingProprietaire || undefined}
              onSubmit={editingProprietaire ? handleUpdateProprietaire : handleAddProprietaire}
              onCancel={cancelForms}
            />
          ) : (
            <ProprietairesTable
              proprietaires={proprietaires}
              onEdit={handleEditProprietaire}
              onDelete={handleDeleteProprietaire}
            />
          )}
        </TabsContent>

        <TabsContent value="biens" className="space-y-6">
          {showBienForm ? (
            <BienForm
              bien={editingBien || undefined}
              proprietaires={proprietaires}
              onSubmit={editingBien ? handleUpdateBien : handleAddBien}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Liste des Biens ({biens.length})</h2>
              {biens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun bien enregistré
                </div>
              ) : (
                <div className="space-y-4">
                  {biens.map((bien) => {
                    const proprietaire = proprietaires.find(p => p.id === bien.proprietaireId);
                    return (
                      <div key={bien.id} className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-fadem-black">
                              {bien.type} - {bien.quartier}
                            </h3>
                            <p className="text-sm text-muted-foreground">{bien.adresse}</p>
                            <p className="text-sm text-muted-foreground">
                              Propriétaire: {proprietaire?.nom} {proprietaire?.prenom}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                bien.statut === 'disponible' ? 'bg-success/10 text-success' :
                                bien.statut === 'loue' ? 'bg-warning/10 text-warning' :
                                'bg-destructive/10 text-destructive'
                              }`}>
                                {bien.statut}
                              </span>
                              {bien.chambres && <span className="text-sm text-muted-foreground">{bien.chambres} chambres</span>}
                              {bien.superficie && <span className="text-sm text-muted-foreground">{bien.superficie} m²</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-fadem-red">{formatCurrency(bien.prixFadem)}/mois</p>
                            <p className="text-sm text-muted-foreground">Commission: {formatCurrency(bien.commission)}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditBien(bien)}>
                                Modifier
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => handleDeleteBien(bien.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locataires" className="space-y-6">
          {showLocataireForm ? (
            <LocataireForm
              locataire={editingLocataire || undefined}
              onSubmit={editingLocataire ? handleUpdateLocataire : handleAddLocataire}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">Locataires ({locataires.length})</h2>
                <Button 
                  onClick={() => setShowLocataireForm(true)}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Locataire
                </Button>
              </div>
              
              {locataires.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun locataire enregistré
                </div>
              ) : (
                <div className="space-y-4">
                  {locataires.map((locataire) => (
                    <div key={locataire.id} className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-fadem-black">
                            {locataire.nom} {locataire.prenom}
                          </h3>
                          <p className="text-sm text-muted-foreground">Téléphone: {locataire.telephone}</p>
                          <p className="text-sm text-muted-foreground">Email: {locataire.email}</p>
                          <p className="text-sm text-muted-foreground">CNI: {locataire.cni}</p>
                          {locataire.profession && (
                            <p className="text-sm text-muted-foreground">Profession: {locataire.profession}</p>
                          )}
                          {locataire.revenus && (
                            <p className="text-sm text-muted-foreground">
                              Revenus: {formatCurrency(locataire.revenus)}/mois
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Contrats actifs: {locataire.contratsActifs.length}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditLocataire(locataire)}>
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleDeleteLocataire(locataire.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contrats" className="space-y-6">
          {showContratForm ? (
            <ContratForm
              contrat={editingContrat || undefined}
              biens={biens}
              locataires={locataires}
              onSubmit={editingContrat ? handleUpdateContrat : handleAddContrat}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">Contrats ({contrats.length})</h2>
                <Button 
                  onClick={() => setShowContratForm(true)}
                  disabled={biens.filter(b => b.statut === 'disponible').length === 0 || locataires.length === 0}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Contrat
                </Button>
              </div>
              
              {biens.filter(b => b.statut === 'disponible').length === 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800">Aucun bien disponible pour créer un contrat.</p>
                </div>
              )}
              
              {locataires.length === 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800">Aucun locataire enregistré pour créer un contrat.</p>
                </div>
              )}
              
              {contrats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun contrat créé
                </div>
              ) : (
                <div className="space-y-4">
                  {contrats.map((contrat) => {
                    const bien = biens.find(b => b.id === contrat.bienId);
                    const locataire = locataires.find(l => l.id === contrat.locataireId);
                    return (
                      <div key={contrat.id} className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-fadem-black">
                              Contrat #{contrat.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Bien: {bien ? `${bien.type} - ${bien.quartier}` : 'Bien non trouvé'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Locataire: {locataire ? `${locataire.nom} ${locataire.prenom}` : 'Locataire non trouvé'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Période: {contrat.dateDebut.toLocaleDateString()} - {contrat.dateFin.toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-fadem-red">
                              Loyer: {formatCurrency(contrat.loyerMensuel)}/mois
                            </p>
                            {contrat.caution > 0 && (
                              <p className="text-sm text-muted-foreground">
                                Caution: {formatCurrency(contrat.caution)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              contrat.statut === 'actif' ? 'bg-success/10 text-success' :
                              contrat.statut === 'suspendu' ? 'bg-warning/10 text-warning' :
                              contrat.statut === 'resilié' ? 'bg-destructive/10 text-destructive' :
                              'bg-muted/10 text-muted-foreground'
                            }`}>
                              {contrat.statut}
                            </span>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditContrat(contrat)}>
                                Modifier
                              </Button>
                              {contrat.statut === 'actif' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => handleResilierContrat(contrat.id)}
                                >
                                  Résilier
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Immobilier;
