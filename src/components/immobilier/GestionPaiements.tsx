
import React, { useState } from 'react';
import { Calendar, CreditCard, AlertTriangle, CheckCircle, Clock, Euro } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';

export const GestionPaiements = () => {
  const { echeances, paiements, locataires, biens, enregistrerPaiement, obtenirStatistiques } = useImmobilierUltra();
  const [selectedEcheance, setSelectedEcheance] = useState<string | null>(null);
  const [montantPaiement, setMontantPaiement] = useState('');
  const [methodePaiement, setMethodePaiement] = useState<'espece' | 'virement' | 'cheque' | 'mobile_money'>('espece');

  const stats = obtenirStatistiques();
  const aujourdhui = new Date();

  // Échéances par statut
  const echeancesEnRetard = echeances.filter(e => 
    e.statut === 'en_attente' && new Date(e.dateEcheance) < aujourdhui
  );
  
  const echeancesCeMois = echeances.filter(e => {
    const dateEcheance = new Date(e.dateEcheance);
    return dateEcheance.getMonth() === aujourdhui.getMonth() && 
           dateEcheance.getFullYear() === aujourdhui.getFullYear();
  });

  const handlePaiement = () => {
    if (!selectedEcheance || !montantPaiement) return;

    enregistrerPaiement({
      echeanceId: selectedEcheance,
      montant: parseFloat(montantPaiement),
      datePaiement: new Date(),
      methode: methodePaiement,
      reference: `PAY-${Date.now()}`,
      fraisSupplementaires: {}
    });

    setSelectedEcheance(null);
    setMontantPaiement('');
  };

  return (
    <div className="space-y-6">
      {/* Métriques de paiement */}
      <ResponsiveGrid cols={{ default: 2, md: 4 }} gap="md">
        <MetricCard
          title="Revenus mensuels"
          value={`${stats.revenus.mensuel.toLocaleString()} CFA`}
          subtitle="Prévu ce mois"
          icon={<Euro className="w-4 h-4" />}
          color="info"
        />
        <MetricCard
          title="Encaissé"
          value={`${stats.revenus.encaisse.toLocaleString()} CFA`}
          subtitle={`${Math.round((stats.revenus.encaisse / stats.revenus.mensuel) * 100)}% du prévu`}
          icon={<CheckCircle className="w-4 h-4" />}
          color="success"
          trend={{ value: 5.2, label: 'vs mois dernier' }}
        />
        <MetricCard
          title="En attente"
          value={`${stats.revenus.enAttente.toLocaleString()} CFA`}
          subtitle={`${stats.paiementsEnRetard} paiements`}
          icon={<Clock className="w-4 h-4" />}
          color="warning"
        />
        <MetricCard
          title="Retards"
          value={`${stats.retards.montant.toLocaleString()} CFA`}
          subtitle={`${stats.retards.nombreLocataires} locataires`}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="danger"
        />
      </ResponsiveGrid>

      <Tabs defaultValue="echeances" className="space-y-6">
        <TabsList>
          <TabsTrigger value="echeances">Échéances</TabsTrigger>
          <TabsTrigger value="retards">Retards</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="echeances">
          <UltraCard title="Échéances de ce mois" variant="glass">
            <div className="space-y-4">
              {echeancesCeMois.map((echeance) => {
                const locataire = locataires.find(l => l.id === echeance.locataireId);
                const bien = biens.find(b => b.id === echeance.bienId);
                
                return (
                  <div 
                    key={echeance.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedEcheance(echeance.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {locataire?.nom.charAt(0)}{locataire?.prenom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{locataire?.nom} {locataire?.prenom}</h4>
                          <p className="text-sm text-muted-foreground">
                            {bien?.nom} - Chambre {echeance.chambreNumero}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg">{echeance.montant.toLocaleString()} CFA</div>
                      <div className="text-sm text-muted-foreground">
                        Échéance: {new Date(echeance.dateEcheance).toLocaleDateString()}
                      </div>
                      <StatusIndicator status={echeance.statut} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </UltraCard>
        </TabsContent>

        <TabsContent value="retards">
          <UltraCard title="Paiements en retard" variant="glass" badge={echeancesEnRetard.length.toString()}>
            <div className="space-y-4">
              {echeancesEnRetard.map((echeance) => {
                const locataire = locataires.find(l => l.id === echeance.locataireId);
                const bien = biens.find(b => b.id === echeance.bienId);
                const joursRetard = Math.floor(
                  (aujourdhui.getTime() - new Date(echeance.dateEcheance).getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={echeance.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-red-900">
                          {locataire?.nom} {locataire?.prenom}
                        </h4>
                        <p className="text-sm text-red-700">
                          {bien?.nom} - Chambre {echeance.chambreNumero}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Retard de {joursRetard} jour(s)
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-red-900">
                          {echeance.montant.toLocaleString()} CFA
                        </div>
                        <Badge className="bg-red-500 text-white mt-2">
                          {joursRetard > 15 ? 'URGENT' : joursRetard > 7 ? 'IMPORTANT' : 'RETARD'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </UltraCard>
        </TabsContent>

        <TabsContent value="historique">
          <UltraCard title="Historique des paiements" variant="glass">
            <div className="space-y-3">
              {paiements.slice(-10).reverse().map((paiement) => {
                const echeance = echeances.find(e => e.id === paiement.echeanceId);
                const locataire = locataires.find(l => l.id === echeance?.locataireId);
                
                return (
                  <div key={paiement.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                    <div>
                      <h4 className="font-medium">{locataire?.nom} {locataire?.prenom}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(paiement.datePaiement).toLocaleDateString()} • {paiement.methode}
                      </p>
                    </div>
                    <div className="font-semibold text-green-600">
                      +{paiement.montant.toLocaleString()} CFA
                    </div>
                  </div>
                );
              })}
            </div>
          </UltraCard>
        </TabsContent>
      </Tabs>

      {/* Modal de paiement rapide */}
      {selectedEcheance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <UltraCard className="w-full max-w-md mx-4">
            <h3 className="font-semibold text-lg mb-4">Enregistrer un paiement</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Montant (CFA)</label>
                <Input
                  type="number"
                  value={montantPaiement}
                  onChange={(e) => setMontantPaiement(e.target.value)}
                  placeholder="Montant du paiement"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Méthode de paiement</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={methodePaiement}
                  onChange={(e) => setMethodePaiement(e.target.value as any)}
                >
                  <option value="espece">Espèces</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="cheque">Chèque</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handlePaiement} className="flex-1">
                  Confirmer
                </Button>
                <Button variant="outline" onClick={() => setSelectedEcheance(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          </UltraCard>
        </div>
      )}
    </div>
  );
};
