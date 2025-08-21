
import React from 'react';
import { MapPin, Users, Home, AlertTriangle } from 'lucide-react';
import { ModernCard } from '@/components/ui/modern-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { BienAmeliore, LocataireAmeliore, Chambre } from '@/types/immobilier';

interface BienOccupationViewProps {
  biens: BienAmeliore[];
  locataires: LocataireAmeliore[];
  onChambreClick: (bien: BienAmeliore, chambre: Chambre) => void;
}

export const BienOccupationView = ({ 
  biens, 
  locataires, 
  onChambreClick 
}: BienOccupationViewProps) => {
  
  const getLocataireInChambre = (bienId: string, chambreNumero: string) => {
    return locataires.find(l => l.bienActuel === bienId && l.chambreActuelle === chambreNumero);
  };

  const getOccupationRate = (bien: BienAmeliore) => {
    const totalChambres = bien.chambres.length;
    const chambresOccupees = bien.chambres.filter(c => c.statut === 'occupee').length;
    return totalChambres > 0 ? (chambresOccupees / totalChambres) * 100 : 0;
  };

  const getTotalRevenue = (bien: BienAmeliore) => {
    return bien.chambres
      .filter(c => c.statut === 'occupee')
      .reduce((total, chambre) => total + chambre.prix, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-fadem-black">Occupation des Biens</h2>
          <p className="text-muted-foreground">Vue d'ensemble des logements</p>
        </div>
      </div>

      <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg">
        {biens.map((bien) => {
          const occupationRate = getOccupationRate(bien);
          const totalRevenue = getTotalRevenue(bien);
          
          return (
            <ModernCard key={bien.id} variant="elevated" className="overflow-hidden">
              <div className="space-y-4">
                {/* Header du bien */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Home size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fadem-black">
                        {bien.type.charAt(0).toUpperCase() + bien.type.slice(1)}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{bien.quartier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {occupationRate.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Occupation</div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {bien.chambres.filter(c => c.statut === 'occupee').length}/{bien.chambres.length} chambres
                    </span>
                    <span className="font-medium text-fadem-black">
                      {totalRevenue.toLocaleString()} CFA/mois
                    </span>
                  </div>
                  <Progress value={occupationRate} className="h-2" />
                </div>

                {/* Grille des chambres */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {bien.chambres.map((chambre) => {
                    const locataire = getLocataireInChambre(bien.id, chambre.numero);
                    
                    return (
                      <div
                        key={chambre.numero}
                        onClick={() => onChambreClick(bien, chambre)}
                        className="p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: chambre.statut === 'occupee' ? 'hsl(var(--success))' : 
                                     chambre.statut === 'maintenance' ? 'hsl(var(--warning))' : 
                                     'hsl(var(--border))',
                          backgroundColor: chambre.statut === 'occupee' ? 'hsl(var(--success) / 0.05)' : 
                                         chambre.statut === 'maintenance' ? 'hsl(var(--warning) / 0.05)' : 
                                         'transparent'
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Ch. {chambre.numero}</span>
                            <StatusBadge status={chambre.statut} size="sm" />
                          </div>
                          
                          {locataire ? (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                  {locataire.nom.charAt(0)}{locataire.prenom.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-fadem-black truncate">
                                  {locataire.nom} {locataire.prenom}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {chambre.prix.toLocaleString()} CFA
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {chambre.prix.toLocaleString()} CFA/mois
                            </div>
                          )}
                          
                          {chambre.statut === 'maintenance' && (
                            <div className="flex items-center space-x-1 text-xs text-warning">
                              <AlertTriangle size={12} />
                              <span>Maintenance</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Informations supplémentaires */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{bien.chambres.filter(c => c.statut === 'occupee').length} locataires</span>
                    </div>
                    <div>
                      Revenu potentiel: {bien.chambres.reduce((sum, c) => sum + c.prix, 0).toLocaleString()} CFA
                    </div>
                  </div>
                </div>
              </div>
            </ModernCard>
          );
        })}
      </ResponsiveGrid>

      {biens.length === 0 && (
        <ModernCard className="text-center py-12">
          <div className="text-muted-foreground">
            Aucun bien enregistré pour le moment.
          </div>
        </ModernCard>
      )}
    </div>
  );
};
