import React, { useState, useEffect } from 'react';
import { Building2, Users, Home, CreditCard, Plus, Search, Filter, Bell, TrendingUp, AlertTriangle, UserPlus } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';
import { GestionPaiements } from '@/components/immobilier/GestionPaiements';
import { ProprietaireFormUltra } from '@/components/forms/ProprietaireFormUltra';
import { BienFormUltra } from '@/components/forms/BienFormUltra';

export default function ImmobilierUltra() {
  const {
    proprietaires,
    biens,
    locataires,
    contrats,
    alertes,
    echeances,
    paiements,
    obtenirStatistiques,
    mettreAJourAlertes
  } = useImmobilierUltra();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showBienForm, setShowBienForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const stats = obtenirStatistiques();

  // Mise à jour automatique des alertes toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(mettreAJourAlertes, 30000);
    return () => clearInterval(interval);
  }, [mettreAJourAlertes]);

  // Alertes non résolues par priorité
  const alertesPrioritaires = alertes
    .filter(a => !a.resolue)
    .sort((a, b) => {
      const priorites = { 'urgente': 4, 'haute': 3, 'moyenne': 2, 'basse': 1 };
      return priorites[b.priorite] - priorites[a.priorite];
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-6 px-4 space-y-6">
        
        {/* Header avec navigation amélioré */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Gestion Immobilière Ultra
            </h1>
            <p className="text-muted-foreground">
              Tableau de bord temps réel • {stats.chambresOccupees} chambres occupées • {alertesPrioritaires.length} alertes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alertes
              {alertesPrioritaires.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {alertesPrioritaires.length}
                </Badge>
              )}
            </Button>
            
            {/* Dropdown pour nouveau */}
            <div className="relative">
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </Button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setShowProprietaireForm(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted rounded-t-lg flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Propriétaire
                  </button>
                  <button
                    onClick={() => {
                      setShowBienForm(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Bien immobilier
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 hover:bg-muted rounded-b-lg flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Locataire
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <ResponsiveGrid cols={{ default: 2, md: 4, lg: 6 }} gap="md">
          <MetricCard
            title="Taux d'occupation"
            value={`${stats.tauxOccupation.toFixed(1)}%`}
            subtitle={`${stats.chambresOccupees}/${stats.chambresOccupees + stats.chambresLibres}`}
            color="success"
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 5.2, label: 'ce mois' }}
          />
          
          <MetricCard
            title="Revenus mensuels"
            value={`${stats.revenus.mensuel.toLocaleString()} CFA`}
            subtitle="Prévu"
            color="info"
            icon={<CreditCard className="w-4 h-4" />}
          />
          
          <MetricCard
            title="Encaissé"
            value={`${stats.revenus.encaisse.toLocaleString()} CFA`}
            subtitle="Ce mois"
            color="success"
            icon={<CreditCard className="w-4 h-4" />}
          />
          
          <MetricCard
            title="En attente"
            value={`${stats.revenus.enAttente.toLocaleString()} CFA`}
            subtitle={`${stats.paiementsEnRetard} paiements`}
            color="warning"
            icon={<AlertTriangle className="w-4 h-4" />}
          />
          
          <MetricCard
            title="Chambres libres"
            value={stats.chambresLibres}
            subtitle="Disponibles"
            color="default"
            icon={<Home className="w-4 h-4" />}
          />
          
          <MetricCard
            title="Retards"
            value={`${stats.retards.montant.toLocaleString()} CFA`}
            subtitle={`${stats.retards.nombreLocataires} locataires`}
            color="danger"
            icon={<AlertTriangle className="w-4 h-4" />}
          />
        </ResponsiveGrid>

        {/* Alertes prioritaires */}
        {alertesPrioritaires.length > 0 && (
          <UltraCard 
            title="Alertes prioritaires" 
            variant="glass"
            icon={<Bell className="w-5 h-5 text-red-500" />}
            badge={alertesPrioritaires.length.toString()}
          >
            <div className="space-y-3">
              {alertesPrioritaires.slice(0, 3).map((alerte) => (
                <div key={alerte.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIndicator 
                        status={alerte.priorite}
                        size="xs" 
                        animated={alerte.priorite === 'urgente'}
                      />
                      <span className="font-medium text-sm">{alerte.titre}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alerte.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-3">
                    Traiter
                  </Button>
                </div>
              ))}
              {alertesPrioritaires.length > 3 && (
                <Button variant="ghost" className="w-full">
                  Voir toutes les alertes ({alertesPrioritaires.length})
                </Button>
              )}
            </div>
          </UltraCard>
        )}

        {/* Navigation par onglets avec paiements */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="biens" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Biens</span>
            </TabsTrigger>
            <TabsTrigger value="locataires" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Locataires</span>
            </TabsTrigger>
            <TabsTrigger value="paiements" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="proprietaires" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Propriétaires</span>
            </TabsTrigger>
            <TabsTrigger value="contrats" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Contrats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Biens par statut */}
            <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
              {biens.map((bien) => {
                const chambresOccupees = bien.chambres.filter(c => c.statut === 'occupee').length;
                const totalChambres = bien.chambres.length;
                const tauxOccupation = totalChambres > 0 ? (chambresOccupees / totalChambres) * 100 : 0;
                
                return (
                  <UltraCard
                    key={bien.id}
                    variant="interactive"
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{bien.nom || bien.type}</h3>
                          <p className="text-sm text-muted-foreground">{bien.quartier}</p>
                          <p className="text-xs text-muted-foreground">{bien.adresse}</p>
                        </div>
                        <StatusIndicator status={bien.statut} size="sm" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Occupation</span>
                          <span className="font-medium">{chambresOccupees}/{totalChambres} ({tauxOccupation.toFixed(0)}%)</span>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${tauxOccupation}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{bien.chambres.filter(c => c.statut === 'libre').length}</div>
                            <div className="text-muted-foreground">Libres</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-orange-600">{bien.chambres.filter(c => c.statut === 'maintenance').length}</div>
                            <div className="text-muted-foreground">Maintenance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UltraCard>
                );
              })}
              
              {biens.length === 0 && (
                <div className="col-span-full">
                  <UltraCard variant="glass" className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun bien enregistré</p>
                      <Button className="mt-4">Ajouter un bien</Button>
                    </div>
                  </UltraCard>
                </div>
              )}
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="locataires" className="space-y-6">
            {/* Barre de recherche */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un locataire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Liste des locataires */}
            <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
              {locataires
                .filter(l => 
                  l.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  l.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  l.telephone.includes(searchTerm)
                )
                .map((locataire) => {
                  const bien = biens.find(b => b.id === locataire.bienActuel);
                  
                  return (
                    <UltraCard
                      key={locataire.id}
                      variant="interactive"
                      className="group hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {locataire.nom.charAt(0)}{locataire.prenom.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{locataire.nom} {locataire.prenom}</h3>
                              <p className="text-sm text-muted-foreground">{locataire.profession}</p>
                            </div>
                          </div>
                          <StatusIndicator status={locataire.statusPaiement} size="sm" />
                        </div>

                        {bien && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm">
                              <p className="font-medium">{bien.nom || bien.type}</p>
                              <p className="text-muted-foreground">
                                Chambre {locataire.chambreActuelle} • {locataire.montantProchainLoyer.toLocaleString()} CFA/mois
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Prochain loyer</span>
                          <span className="font-medium">
                            {locataire.dateProchainLoyer.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </UltraCard>
                  );
                })}
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="paiements">
            <GestionPaiements />
          </TabsContent>

          <TabsContent value="proprietaires" className="space-y-6">
            {/* Barre d'actions propriétaires */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Propriétaires</h2>
              <Button onClick={() => setShowProprietaireForm(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Nouveau Propriétaire
              </Button>
            </div>

            {/* Liste des propriétaires */}
            <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
              {proprietaires.map((proprietaire) => (
                <UltraCard
                  key={proprietaire.id}
                  variant="interactive"
                  className="group hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {proprietaire.nom.charAt(0)}{proprietaire.prenom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{proprietaire.nom} {proprietaire.prenom}</h3>
                          <p className="text-sm text-muted-foreground">{proprietaire.telephone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biens confiés:</span>
                        <span className="font-medium">{proprietaire.biensConfies.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact préféré:</span>
                        <Badge variant="secondary">{proprietaire.contactPreference}</Badge>
                      </div>
                      {proprietaire.email && (
                        <div className="text-xs text-muted-foreground">{proprietaire.email}</div>
                      )}
                    </div>
                  </div>
                </UltraCard>
              ))}

              {proprietaires.length === 0 && (
                <div className="col-span-full">
                  <UltraCard variant="glass" className="text-center py-12">
                    <div className="text-muted-foreground">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun propriétaire enregistré</p>
                      <Button className="mt-4" onClick={() => setShowProprietaireForm(true)}>
                        Ajouter le premier propriétaire
                      </Button>
                    </div>
                  </UltraCard>
                </div>
              )}
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="contrats">
            <UltraCard title="Gestion des contrats" variant="glass">
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Interface de contrats en cours de développement</p>
              </div>
            </UltraCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showProprietaireForm && (
        <ProprietaireFormUltra 
          onClose={() => setShowProprietaireForm(false)}
          onSuccess={() => {
            // Rafraîchir ou afficher notification
            console.log('Propriétaire ajouté avec succès!');
          }}
        />
      )}

      {showBienForm && (
        <BienFormUltra 
          onClose={() => setShowBienForm(false)}
          onSuccess={() => {
            console.log('Bien ajouté avec succès!');
          }}
        />
      )}
    </div>
  );
}
