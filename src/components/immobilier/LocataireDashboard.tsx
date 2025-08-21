
import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LocataireAmeliore, AlerteImmobilier } from '@/types/immobilier';

interface LocataireDashboardProps {
  locataires: LocataireAmeliore[];
  alertes: AlerteImmobilier[];
  onAddLocataire: () => void;
  onEditLocataire: (locataire: LocataireAmeliore) => void;
  onViewLocataire: (locataire: LocataireAmeliore) => void;
}

export const LocataireDashboard = ({
  locataires,
  alertes,
  onAddLocataire,
  onEditLocataire,
  onViewLocataire
}: LocataireDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLocataires = locataires.filter(locataire => {
    const matchesSearch = 
      locataire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locataire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locataire.telephone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || locataire.statusPaiement === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getInitials = (nom: string, prenom: string) => {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Locataires</h1>
          <p className="text-muted-foreground">
            {locataires.length} locataire{locataires.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button onClick={onAddLocataire} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} className="mr-2" />
          Nouveau Locataire
        </Button>
      </div>

      {/* Statistiques rapides */}
      <ResponsiveGrid cols={{ default: 2, md: 4 }} gap="md">
        <ModernCard variant="gradient" size="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {locataires.filter(l => l.statusPaiement === 'a_jour').length}
            </div>
            <div className="text-sm text-muted-foreground">À jour</div>
          </div>
        </ModernCard>
        
        <ModernCard variant="gradient" size="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {locataires.filter(l => l.statusPaiement === 'retard_leger').length}
            </div>
            <div className="text-sm text-muted-foreground">Retard léger</div>
          </div>
        </ModernCard>
        
        <ModernCard variant="gradient" size="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">
              {locataires.filter(l => l.statusPaiement === 'retard_important').length}
            </div>
            <div className="text-sm text-muted-foreground">Retard important</div>
          </div>
        </ModernCard>
        
        <ModernCard variant="gradient" size="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {alertes.filter(a => !a.resolue).length}
            </div>
            <div className="text-sm text-muted-foreground">Alertes</div>
          </div>
        </ModernCard>
      </ResponsiveGrid>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Tous
          </Button>
          <Button
            variant={filterStatus === 'a_jour' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('a_jour')}
          >
            À jour
          </Button>
          <Button
            variant={filterStatus === 'retard_leger' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('retard_leger')}
          >
            En retard
          </Button>
        </div>
      </div>

      {/* Liste des locataires */}
      <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
        {filteredLocataires.map((locataire) => (
          <ModernCard 
            key={locataire.id}
            variant="bordered"
            className="transition-colors"
            onClick={() => onViewLocataire(locataire)}
          >
            <div className="space-y-4">
              {/* Header avec avatar et status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(locataire.nom, locataire.prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {locataire.nom} {locataire.prenom}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locataire.profession}
                    </p>
                  </div>
                </div>
                <StatusBadge status={locataire.statusPaiement} size="sm" />
              </div>

              {/* Informations de localisation */}
              {locataire.bienActuel && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  <span>
                    Chambre {locataire.chambreActuelle || 'N/A'}
                  </span>
                </div>
              )}

              {/* Contact et actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Phone size={16} />
                  </Button>
                  {locataire.email && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Mail size={16} />
                    </Button>
                  )}
                </div>
                
                {locataire.statusPaiement !== 'a_jour' && (
                  <Badge variant="outline" className="text-xs">
                    <AlertCircle size={12} className="mr-1" />
                    {locataire.soldeCompte < 0 ? `${Math.abs(locataire.soldeCompte).toLocaleString()} CFA` : 'Avance'}
                  </Badge>
                )}
              </div>

              {/* Prochain paiement */}
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Prochain loyer: {locataire.dateProchainLoyer.toLocaleDateString()}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {locataire.montantProchainLoyer.toLocaleString()} CFA
                </div>
              </div>
            </div>
          </ModernCard>
        ))}
      </ResponsiveGrid>

      {filteredLocataires.length === 0 && (
        <ModernCard className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm ? 'Aucun locataire trouvé pour cette recherche.' : 'Aucun locataire enregistré.'}
          </div>
        </ModernCard>
      )}
    </div>
  );
};
