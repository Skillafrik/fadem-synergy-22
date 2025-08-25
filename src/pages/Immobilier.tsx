
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
import { ProprietaireFormUltra } from '@/components/forms/ProprietaireFormUltra';
import { BienFormUltra } from '@/components/forms/BienFormUltra';
import { LocataireFormUltra } from '@/components/forms/LocataireFormUltra';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';

export default function Immobilier() {
  const { toast } = useToast();
  const { 
    proprietaires, 
    biens, 
    locataires, 
    contrats,
    ajouterProprietaire,
    ajouterBien,
    ajouterLocataire,
    creerContrat,
    data
  } = useImmobilierUltra();

  // États pour les formulaires
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showBienForm, setShowBienForm] = useState(false);
  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [showContratForm, setShowContratForm] = useState(false);

  // Debug: Afficher les données en console avec plus de détails
  useEffect(() => {
    console.log('[Immobilier] Hook useImmobilierUltra chargé');
    console.log('[Immobilier] Données complètes:', data);
    console.log('[Immobilier] Détail des données:', {
      proprietaires: proprietaires?.length || 0,
      biens: biens?.length || 0,
      locataires: locataires?.length || 0,
      contrats: contrats?.length || 0,
      proprietairesArray: proprietaires,
      biensArray: biens,
      locatairesArray: locataires,
      contratsArray: contrats
    });
  }, [proprietaires, biens, locataires, contrats, data]);

  // Handlers simplifiés avec meilleur logging
  const handleSuccessProprietaire = () => {
    console.log('[Immobilier] Succès ajout propriétaire');
    setShowProprietaireForm(false);
    toast({
      title: "Succès",
      description: "Propriétaire ajouté avec succès",
    });
  };

  const handleSuccessBien = () => {
    console.log('[Immobilier] Succès ajout bien');
    setShowBienForm(false);
    toast({
      title: "Succès",
      description: "Bien ajouté avec succès",
    });
  };

  const handleSuccessLocataire = () => {
    console.log('[Immobilier] Succès ajout locataire');
    setShowLocataireForm(false);
    toast({
      title: "Succès",
      description: "Locataire ajouté avec succès",
    });
  };

  const handleSupprimerProprietaire = (id: string) => {
    console.log('[Immobilier] Tentative suppression propriétaire:', id);
    // Pour l'instant, on ne supprime pas car la fonction n'existe pas dans useImmobilierUltra
    toast({
      title: "Information",
      description: "La suppression sera implémentée prochainement",
      variant: "default"
    });
  };

  const handleSupprimerBien = (id: string) => {
    console.log('[Immobilier] Tentative suppression bien:', id);
    toast({
      title: "Information",
      description: "La suppression sera implémentée prochainement",
      variant: "default"
    });
  };

  const handleSupprimerLocataire = (id: string) => {
    console.log('[Immobilier] Tentative suppression locataire:', id);
    toast({
      title: "Information",
      description: "La suppression sera implémentée prochainement",
      variant: "default"
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            Gestion Immobilière FADEM Ultra
          </CardTitle>
          <CardDescription>
            Gérez vos propriétaires, biens, locataires et contrats de location de manière professionnelle.
          </CardDescription>
          
          {/* Indicateurs de statut améliorés */}
          <div className="flex gap-2 mt-2">
            <Badge variant={proprietaires?.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {proprietaires?.length || 0} Propriétaires
            </Badge>
            <Badge variant={biens?.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {biens?.length || 0} Biens
            </Badge>
            <Badge variant={locataires?.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {locataires?.length || 0} Locataires
            </Badge>
            <Badge variant={contrats?.length > 0 ? "default" : "secondary"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {contrats?.length || 0} Contrats
            </Badge>
          </div>

          {/* Debug info */}
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
            Debug: Hook Ultra actif - Dernière MAJ: {data?.derniereMAJ ? new Date(data.derniereMAJ).toLocaleString() : 'Non définie'}
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
                  onClick={() => {
                    console.log('[Immobilier] Ouverture formulaire propriétaire');
                    setShowProprietaireForm(true);
                  }}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Propriétaire
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {!proprietaires || proprietaires.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun propriétaire enregistré</p>
                        <p className="text-sm">Ajoutez votre premier propriétaire pour commencer</p>
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
                                <td className="p-2 font-medium">{proprietaire.nom} {proprietaire.prenom}</td>
                                <td className="p-2">{proprietaire.telephone}</td>
                                <td className="p-2">{proprietaire.email || '-'}</td>
                                <td className="p-2">{proprietaire.adresse}</td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => console.log('Édition propriétaire:', proprietaire.id)}
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
                  onClick={() => {
                    console.log('[Immobilier] Ouverture formulaire bien');
                    setShowBienForm(true);
                  }}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Bien
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {!biens || biens.length === 0 ? (
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
                              <th className="text-left p-2">Chambres</th>
                              <th className="text-left p-2">Statut</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {biens.map((bien) => {
                              const proprietaire = proprietaires?.find(p => p.id === bien.proprietaireId);
                              return (
                                <tr key={bien.id} className="border-b hover:bg-gray-50">
                                  <td className="p-2 font-medium">{bien.type}</td>
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{bien.adresse}</p>
                                      <p className="text-sm text-muted-foreground">{bien.quartier}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">{proprietaire?.nom} {proprietaire?.prenom}</td>
                                  <td className="p-2">{bien.chambres?.length || 0} chambres</td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={
                                        bien.statut === 'disponible' ? 'default' :
                                        bien.statut === 'complet' ? 'secondary' :
                                        bien.statut === 'partiellement_loue' ? 'outline' : 'destructive'
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
                                        onClick={() => console.log('Édition bien:', bien.id)}
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
                  onClick={() => {
                    console.log('[Immobilier] Ouverture formulaire locataire');
                    setShowLocataireForm(true);
                  }}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Locataire
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {!locataires || locataires.length === 0 ? (
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
                              <th className="text-left p-2">Statut Paiement</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {locataires.map((locataire) => (
                              <tr key={locataire.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-medium">{locataire.nom} {locataire.prenom}</td>
                                <td className="p-2">{locataire.telephone}</td>
                                <td className="p-2">{locataire.email || '-'}</td>
                                <td className="p-2">
                                  <Badge 
                                    variant={
                                      locataire.statusPaiement === 'a_jour' ? 'default' :
                                      locataire.statusPaiement === 'retard_leger' ? 'secondary' :
                                      'destructive'
                                    }
                                  >
                                    {locataire.statusPaiement}
                                  </Badge>
                                </td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => console.log('Édition locataire:', locataire.id)}
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
                  onClick={() => {
                    console.log('[Immobilier] Ouverture formulaire contrat');
                    setShowContratForm(true);
                  }}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Contrat
                </Button>
              </div>

              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    {!contrats || contrats.length === 0 ? (
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
                              <th className="text-left p-2">Montant</th>
                              <th className="text-left p-2">Début</th>
                              <th className="text-left p-2">Statut</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contrats.map((contrat) => {
                              const bien = biens?.find(b => b.id === contrat.bienId);
                              const locataire = locataires?.find(l => l.id === contrat.locataireId);
                              
                              return (
                                <tr key={contrat.id} className="border-b hover:bg-gray-50">
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{bien?.type}</p>
                                      <p className="text-sm text-muted-foreground">Chambre {contrat.chambreNumero}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{locataire?.nom} {locataire?.prenom}</p>
                                      <p className="text-sm text-muted-foreground">{locataire?.telephone}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <p className="font-medium">{contrat.montantMensuel.toLocaleString()} CFA</p>
                                    <p className="text-sm text-muted-foreground">
                                      Caution: {contrat.caution.toLocaleString()} CFA
                                    </p>
                                  </td>
                                  <td className="p-2">
                                    {new Date(contrat.dateDebut).toLocaleDateString()}
                                  </td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={
                                        contrat.statut === 'actif' ? 'default' :
                                        contrat.statut === 'suspendu' ? 'secondary' :
                                        'destructive'
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
                                        onClick={() => console.log('Édition contrat:', contrat.id)}
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => console.log('Résiliation contrat:', contrat.id)}
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
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals avec meilleure gestion */}
      {showProprietaireForm && (
        <ProprietaireFormUltra
          onClose={() => {
            console.log('[Immobilier] Fermeture formulaire propriétaire');
            setShowProprietaireForm(false);
          }}
          onSuccess={handleSuccessProprietaire}
        />
      )}

      {showBienForm && (
        <BienFormUltra
          onClose={() => {
            console.log('[Immobilier] Fermeture formulaire bien');
            setShowBienForm(false);
          }}
          onSuccess={handleSuccessBien}
        />
      )}

      {showLocataireForm && (
        <LocataireFormUltra
          onClose={() => {
            console.log('[Immobilier] Fermeture formulaire locataire');
            setShowLocataireForm(false);
          }}
          onSuccess={handleSuccessLocataire}
        />
      )}
    </div>
  );
}
