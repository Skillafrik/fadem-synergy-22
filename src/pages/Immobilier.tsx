import { useState, useEffect } from 'react';
import { Building, Plus, Edit, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProprietaireForm } from '@/components/forms/ProprietaireForm';
import { BienForm } from '@/components/forms/BienForm';
import { LocataireForm } from '@/components/forms/LocataireForm';
import { ContratForm } from '@/components/forms/ContratForm';
import { useImmobilier } from '@/hooks/useImmobilier';
import { Proprietaire, Bien, Locataire, Contrat } from '@/types';

export default function Immobilier() {
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

  // Handlers pour les propriétaires
  const handleAjouterProprietaire = (proprietaire: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    ajouterProprietaire(proprietaire);
    setShowProprietaireForm(false);
  };

  const handleModifierProprietaire = (id: string, updates: Partial<Proprietaire>) => {
    modifierProprietaire(id, updates);
    setProprietaireAModifier(null);
  };

  const handleSupprimerProprietaire = (id: string) => {
    try {
      supprimerProprietaire(id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handlers pour les biens
  const handleAjouterBien = (bien: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    ajouterBien(bien);
    setShowBienForm(false);
  };

  const handleModifierBien = (id: string, updates: Partial<Bien>) => {
    modifierBien(id, updates);
    setBienAModifier(null);
  };

  const handleSupprimerBien = (id: string) => {
    try {
      supprimerBien(id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handlers pour les locataires
  const handleAjouterLocataire = (locataire: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => {
    ajouterLocataire(locataire);
    setShowLocataireForm(false);
  };

  const handleModifierLocataire = (id: string, updates: Partial<Locataire>) => {
    modifierLocataire(id, updates);
    setLocataireAModifier(null);
  };

  const handleSupprimerLocataire = (id: string) => {
    try {
      supprimerLocataire(id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handlers pour les contrats
  const handleCreerContrat = (contrat: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures' | 'proprietaireId'>) => {
    creerContrat({
      ...contrat,
      proprietaireId: biens.find(b => b.id === contrat.bienId)?.proprietaireId || 'unknown'
    });
    setShowContratForm(false);
  };

  const handleModifierContrat = (id: string, updates: Partial<Contrat>) => {
    modifierContrat(id, updates);
    setContratAModifier(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gestion Immobilière FADEM</CardTitle>
          <CardDescription>
            Gérez vos propriétaires, biens, locataires et contrats de location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proprietaires" className="space-y-4">
            <TabsList>
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
