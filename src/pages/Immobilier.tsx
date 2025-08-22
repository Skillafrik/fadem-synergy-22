import { useState, useEffect } from 'react';
import { Building, Plus, Edit, X, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast';
import { ProprietaireForm } from '@/components/forms/ProprietaireForm';
import { BienForm } from '@/components/forms/BienForm';
import { LocataireForm } from '@/components/forms/LocataireForm';
import { ContratForm } from '@/components/forms/ContratForm';
import { useImmobilier } from '@/hooks/useImmobilier';
import { Proprietaire, Bien, Locataire, Contrat } from '@/types';

export default function Immobilier() {
  const { toast } = useToast();
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
    resilierContrat
  } = useImmobilier();

  // États pour les formulaires
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [proprietaireAModifier, setProprietaireAModifier] = useState<Proprietaire | null>(null);

  const [showBienForm, setShowBienForm] = useState(false);
  const [bienAModifier, setBienAModifier] = useState<Bien | null>(null);

  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [locataireAModifier, setLocataireAModifier] = useState<Locataire | null>(null);

  const [showContratForm, setShowContratForm] = useState(false);
  const [contratAModifier, setContratAModifier] = useState<Contrat | null>(null);

  // Debug: Afficher les données en console
  useEffect(() => {
    console.log('[Immobilier] Données actuelles:', {
      proprietaires: proprietaires.length,
      biens: biens.length,
      locataires: locataires.length,
      contrats: contrats.length
    });
  }, [proprietaires, biens, locataires, contrats]);

  // Handlers pour les propriétaires
  const handleAjouterProprietaire = async (proprietaire: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    try {
      console.log('[Immobilier] Tentative ajout propriétaire:', proprietaire);
      const nouveau = ajouterProprietaire(proprietaire);
      console.log('[Immobilier] Propriétaire ajouté:', nouveau);
      
      toast({
        title: "Succès",
        description: `Propriétaire ${proprietaire.nom} ${proprietaire.prenom} ajouté avec succès`,
      });
      
      setShowProprietaireForm(false);
    } catch (error: any) {
      console.error('[Immobilier] Erreur ajout propriétaire:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le propriétaire",
        variant: "destructive"
      });
    }
  };

  const handleModifierProprietaire = (id: string, updates: Partial<Proprietaire>) => {
    try {
      modifierProprietaire(id, updates);
      toast({
        title: "Succès",
        description: "Propriétaire modifié avec succès",
      });
      setProprietaireAModifier(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le propriétaire",
        variant: "destructive"
      });
    }
  };

  const handleSupprimerProprietaire = (id: string) => {
    try {
      supprimerProprietaire(id);
      toast({
        title: "Succès",
        description: "Propriétaire supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handlers pour les biens
  const handleAjouterBien = async (bien: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    try {
      console.log('[Immobilier] Tentative ajout bien:', bien);
      const nouveau = ajouterBien(bien);
      console.log('[Immobilier] Bien ajouté:', nouveau);
      
      toast({
        title: "Succès",
        description: `Bien ${bien.type} ajouté avec succès`,
      });
      
      setShowBienForm(false);
    } catch (error: any) {
      console.error('[Immobilier] Erreur ajout bien:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le bien",
        variant: "destructive"
      });
    }
  };

  const handleModifierBien = (id: string, updates: Partial<Bien>) => {
    try {
      modifierBien(id, updates);
      toast({
        title: "Succès",
        description: "Bien modifié avec succès",
      });
      setBienAModifier(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le bien",
        variant: "destructive"
      });
    }
  };

  const handleSupprimerBien = (id: string) => {
    try {
      supprimerBien(id);
      toast({
        title: "Succès",
        description: "Bien supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handlers pour les locataires
  const handleAjouterLocataire = async (locataire: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => {
    try {
      console.log('[Immobilier] Tentative ajout locataire:', locataire);
      const nouveau = ajouterLocataire(locataire);
      console.log('[Immobilier] Locataire ajouté:', nouveau);
      
      toast({
        title: "Succès",
        description: `Locataire ${locataire.nom} ${locataire.prenom} ajouté avec succès`,
      });
      
      setShowLocataireForm(false);
    } catch (error: any) {
      console.error('[Immobilier] Erreur ajout locataire:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le locataire",
        variant: "destructive"
      });
    }
  };

  const handleModifierLocataire = (id: string, updates: Partial<Locataire>) => {
    try {
      modifierLocataire(id, updates);
      toast({
        title: "Succès",
        description: "Locataire modifié avec succès",
      });
      setLocataireAModifier(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le locataire",
        variant: "destructive"
      });
    }
  };

  const handleSupprimerLocataire = (id: string) => {
    try {
      supprimerLocataire(id);
      toast({
        title: "Succès",
        description: "Locataire supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handlers pour les contrats
  const handleCreerContrat = async (contrat: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures' | 'proprietaireId'>) => {
    try {
      console.log('[Immobilier] Tentative création contrat:', contrat);
      const nouveau = creerContrat({
        ...contrat,
        proprietaireId: biens.find(b => b.id === contrat.bienId)?.proprietaireId || 'unknown'
      });
      console.log('[Immobilier] Contrat créé:', nouveau);
      
      toast({
        title: "Succès",
        description: "Contrat créé avec succès",
      });
      
      setShowContratForm(false);
    } catch (error: any) {
      console.error('[Immobilier] Erreur création contrat:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le contrat",
        variant: "destructive"
      });
    }
  };

  const handleModifierContrat = (id: string, updates: Partial<Contrat>) => {
    try {
      modifierContrat(id, updates);
      toast({
        title: "Succès",
        description: "Contrat modifié avec succès",
      });
      setContratAModifier(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le contrat",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            Gestion Immobilière FADEM
          </CardTitle>
          <CardDescription>
            Gérez vos propriétaires, biens, locataires et contrats de location.
          </CardDescription>
          
          {/* Indicateurs de debug */}
          <div className="flex gap-2 mt-2">
            <Badge variant={proprietaires.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {proprietaires.length} Propriétaires
            </Badge>
            <Badge variant={biens.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {biens.length} Biens
            </Badge>
            <Badge variant={locataires.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {locataires.length} Locataires
            </Badge>
            <Badge variant={contrats.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {contrats.length} Contrats
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="proprietaires" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="proprietaires">Propriétaires</TabsTrigger>
              <TabsTrigger value="biens">Biens</TabsTrigger>
              <TabsTrigger value="locataires">Locataires</TabsTrigger>
              <TabsTrigger value="contrats">Contrats</TabsTrigger>
            </TabsList>

            <TabsContent value="proprietaires" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-fadem-black">Propriétaires</h2>
                <Button 
                  onClick={() => setShowProprietaireForm(true)}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Propriétaire
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {proprietaires.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun propriétaire enregistré</p>
                        <p className="text-sm">Ajoutez votre premier propriétaire</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Nom</th>
                              <th className="text-left p-2">Téléphone</th>
                              <th className="text-left p-2">Email</th>
                              <th className="text-left p-2">Adresse</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proprietaires.map((proprietaire) => (
                              <tr key={proprietaire.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{proprietaire.nom} {proprietaire.prenom}</td>
                                <td className="p-2">{proprietaire.telephone}</td>
                                <td className="p-2">{proprietaire.email || '-'}</td>
                                <td className="p-2">{proprietaire.adresse}</td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setProprietaireAModifier(proprietaire);
                                        setShowProprietaireForm(true);
                                      }}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleSupprimerProprietaire(proprietaire.id)}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="biens" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-fadem-black">Biens Immobiliers</h2>
                <Button 
                  onClick={() => setShowBienForm(true)}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Bien
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {biens.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun bien enregistré</p>
                        <p className="text-sm">Ajoutez votre premier bien immobilier</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Adresse</th>
                              <th className="text-left p-2">Propriétaire</th>
                              <th className="text-left p-2">Prix FADEM</th>
                              <th className="text-left p-2">Statut</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {biens.map((bien) => {
                              const proprietaire = proprietaires.find(p => p.id === bien.proprietaireId);
                              return (
                                <tr key={bien.id} className="border-b hover:bg-gray-50">
                                  <td className="p-2">{bien.type}</td>
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{bien.adresse}</p>
                                      <p className="text-sm text-muted-foreground">{bien.quartier}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">{proprietaire?.nom} {proprietaire?.prenom}</td>
                                  <td className="p-2">{bien.prixFadem.toLocaleString()} CFA</td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={
                                        bien.statut === 'disponible' ? 'default' :
                                        bien.statut === 'loue' ? 'secondary' :
                                        bien.statut === 'maintenance' ? 'outline' : 'destructive'
                                      }
                                    >
                                      {bien.statut}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setBienAModifier(bien);
                                          setShowBienForm(true);
                                        }}
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleSupprimerBien(bien.id)}
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="locataires" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-fadem-black">Locataires</h2>
                <Button 
                  onClick={() => setShowLocataireForm(true)}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Locataire
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {locataires.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun locataire enregistré</p>
                        <p className="text-sm">Ajoutez votre premier locataire</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Nom</th>
                              <th className="text-left p-2">Téléphone</th>
                              <th className="text-left p-2">Email</th>
                              <th className="text-left p-2">Adresse</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {locataires.map((locataire) => (
                              <tr key={locataire.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{locataire.nom} {locataire.prenom}</td>
                                <td className="p-2">{locataire.telephone}</td>
                                <td className="p-2">{locataire.email || '-'}</td>
                                <td className="p-2">{locataire.adresse}</td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setLocataireAModifier(locataire);
                                        setShowLocataireForm(true);
                                      }}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleSupprimerLocataire(locataire.id)}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contrats" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-fadem-black">Contrats de Location</h2>
                <Button 
                  onClick={() => setShowContratForm(true)}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Contrat
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {contrats.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun contrat enregistré</p>
                        <p className="text-sm">Créez votre premier contrat de location</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Bien</th>
                              <th className="text-left p-2">Locataire</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Montant</th>
                              <th className="text-left p-2">Début</th>
                              <th className="text-left p-2">Fin</th>
                              <th className="text-left p-2">Statut</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contrats.map((contrat) => {
                              const bien = biens.find(b => b.id === contrat.bienId);
                              const locataire = locataires.find(l => l.id === contrat.locataireId);
                              
                              return (
                                <tr key={contrat.id} className="border-b hover:bg-gray-50">
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{bien?.type}</p>
                                      <p className="text-sm text-muted-foreground">{bien?.quartier}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{locataire?.nom} {locataire?.prenom}</p>
                                      <p className="text-sm text-muted-foreground">{locataire?.telephone}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <Badge variant={contrat.type === 'location' ? 'default' : 'secondary'}>
                                      {contrat.type === 'location' ? 'Location' : 'Vente'}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <p className="font-medium">{contrat.montantMensuel.toLocaleString()} CFA</p>
                                    <p className="text-sm text-muted-foreground">
                                      Caution: {contrat.caution.toLocaleString()} CFA
                                    </p>
                                  </td>
                                  <td className="p-2">
                                    {contrat.dateDebut.toLocaleDateString()}
                                  </td>
                                  <td className="p-2">
                                    {contrat.dateFin ? contrat.dateFin.toLocaleDateString() : 'Non définie'}
                                  </td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={
                                        contrat.statut === 'actif' ? 'default' :
                                        contrat.statut === 'suspendu' ? 'secondary' :
                                        contrat.statut === 'expire' ? 'destructive' : 'outline'
                                      }
                                    >
                                      {contrat.statut}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setContratAModifier(contrat);
                                          setShowContratForm(true);
                                        }}
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      {contrat.statut === 'actif' && (
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => resilierContrat(contrat.id)}
                                        >
                                          <X size={16} />
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showProprietaireForm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative m-auto mt-20 max-w-lg">
            <ProprietaireForm 
              proprietaire={proprietaireAModifier || undefined}
              onSubmit={proprietaireAModifier ? (updates) => handleModifierProprietaire(proprietaireAModifier.id, updates) : handleAjouterProprietaire}
              onCancel={() => {
                setShowProprietaireForm(false);
                setProprietaireAModifier(null);
              }}
            />
          </div>
        </div>
      )}

      {showBienForm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative m-auto mt-20 max-w-lg">
            <BienForm
              bien={bienAModifier || undefined}
              proprietaires={proprietaires}
              onSubmit={bienAModifier ? (updates) => handleModifierBien(bienAModifier.id, updates) : handleAjouterBien}
              onCancel={() => {
                setShowBienForm(false);
                setBienAModifier(null);
              }}
            />
          </div>
        </div>
      )}

      {showLocataireForm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative m-auto mt-20 max-w-lg">
            <LocataireForm
              locataire={locataireAModifier || undefined}
              onSubmit={locataireAModifier ? (updates) => handleModifierLocataire(locataireAModifier.id, updates) : handleAjouterLocataire}
              onCancel={() => {
                setShowLocataireForm(false);
                setLocataireAModifier(null);
              }}
            />
          </div>
        </div>
      )}

      {showContratForm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative m-auto mt-20 max-w-lg">
            <ContratForm
              contrat={contratAModifier || undefined}
              biens={biens}
              locataires={locataires}
              onSubmit={contratAModifier ? (updates) => handleModifierContrat(contratAModifier.id, updates) : handleCreerContrat}
              onCancel={() => {
                setShowContratForm(false);
                setContratAModifier(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
