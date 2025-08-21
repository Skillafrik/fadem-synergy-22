
import React, { useState } from 'react';
import { Home, MapPin, Camera, Plus, Save, X, Building } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';

interface BienFormUltraProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const BienFormUltra = ({ onClose, onSuccess }: BienFormUltraProps) => {
  const { ajouterBien, proprietaires } = useImmobilierUltra();
  
  const [formData, setFormData] = useState({
    proprietaireId: '',
    type: 'appartement' as 'appartement' | 'maison' | 'studio' | 'bureau' | 'commerce',
    nom: '',
    adresse: '',
    quartier: '',
    ville: 'Douala',
    superficie: 0,
    nbrChambres: 1,
    etages: 1,
    prixFadem: 0,
    description: '',
    equipements: [] as string[],
    photos: {
      facade: [] as string[],
      chambres: {} as Record<string, string[]>,
      communs: [] as string[]
    }
  });

  const [chambres, setChambres] = useState([
    {
      numero: '1',
      superficie: 20,
      prix: 50000,
      equipements: [] as string[],
      photos: [] as string[],
      statut: 'libre' as 'libre' | 'occupee' | 'maintenance' | 'reservee',
      niveau: 1,
      description: ''
    }
  ]);

  const [loading, setLoading] = useState(false);

  const equipementsDisponibles = [
    'Climatisation', 'Ventilateur', 'Réfrigérateur', 'Télévision',
    'WiFi', 'Eau courante', 'Électricité', 'Sécurité 24h/24',
    'Parking', 'Jardin', 'Balcon', 'Cuisine équipée'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bienData = {
        ...formData,
        chambres: chambres.map(chambre => ({
          ...chambre,
          dateOccupation: chambre.statut === 'occupee' ? new Date() : undefined
        }))
      };

      await ajouterBien(bienData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur ajout bien:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ajouterChambre = () => {
    const nouvelleChambre = {
      numero: (chambres.length + 1).toString(),
      superficie: 20,
      prix: 50000,
      equipements: [],
      photos: [],
      statut: 'libre' as const,
      niveau: 1,
      description: ''
    };
    setChambres(prev => [...prev, nouvelleChambre]);
    setFormData(prev => ({ ...prev, nbrChambres: chambres.length + 1 }));
  };

  const supprimerChambre = (index: number) => {
    if (chambres.length > 1) {
      setChambres(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({ ...prev, nbrChambres: chambres.length - 1 }));
    }
  };

  const modifierChambre = (index: number, field: string, value: string | number) => {
    setChambres(prev => prev.map((chambre, i) => {
      if (i === index) {
        // Handle numeric fields by converting string to number when needed
        if (field === 'superficie' || field === 'prix' || field === 'niveau') {
          const numericValue = typeof value === 'string' ? Number(value) || 0 : value;
          return { ...chambre, [field]: numericValue };
        }
        // Handle other fields as strings
        return { ...chambre, [field]: value };
      }
      return chambre;
    }));
  };

  const toggleEquipement = (equipement: string) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter(e => e !== equipement)
        : [...prev.equipements, equipement]
    }));
  };

  const toggleEquipementChambre = (chambreIndex: number, equipement: string) => {
    setChambres(prev => prev.map((chambre, i) => {
      if (i === chambreIndex) {
        return {
          ...chambre,
          equipements: chambre.equipements.includes(equipement)
            ? chambre.equipements.filter(e => e !== equipement)
            : [...chambre.equipements, equipement]
        };
      }
      return chambre;
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <UltraCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6 text-primary" />
            Nouveau Bien Immobilier
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="w-5 h-5" />
              Informations générales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Propriétaire *</label>
                <select
                  required
                  value={formData.proprietaireId}
                  onChange={(e) => handleInputChange('proprietaireId', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="">Sélectionner un propriétaire</option>
                  {proprietaires.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.nom} {prop.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type de bien *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="studio">Studio</option>
                  <option value="bureau">Bureau</option>
                  <option value="commerce">Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nom du bien</label>
                <Input
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex: Résidence Étoile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quartier *</label>
                <Input
                  required
                  value={formData.quartier}
                  onChange={(e) => handleInputChange('quartier', e.target.value)}
                  placeholder="Ex: Bonanjo, Akwa..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Adresse complète *
                </label>
                <Input
                  required
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète du bien"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Superficie totale (m²)</label>
                <Input
                  type="number"
                  value={formData.superficie.toString()}
                  onChange={(e) => handleInputChange('superficie', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nombre d'étages</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.etages.toString()}
                  onChange={(e) => handleInputChange('etages', Number(e.target.value))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Prix FADEM (commission)</label>
                <Input
                  type="number"
                  value={formData.prixFadem.toString()}
                  onChange={(e) => handleInputChange('prixFadem', Number(e.target.value))}
                  placeholder="Commission FADEM en CFA"
                />
              </div>
            </div>
          </div>

          {/* Équipements généraux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Équipements généraux</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {equipementsDisponibles.map((equipement) => (
                <Badge
                  key={equipement}
                  variant={formData.equipements.includes(equipement) ? "default" : "outline"}
                  className="cursor-pointer justify-center py-2"
                  onClick={() => toggleEquipement(equipement)}
                >
                  {equipement}
                </Badge>
              ))}
            </div>
          </div>

          {/* Gestion des chambres */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chambres ({chambres.length})</h3>
              <Button type="button" onClick={ajouterChambre} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une chambre
              </Button>
            </div>

            <div className="grid gap-4">
              {chambres.map((chambre, index) => (
                <UltraCard key={index} variant="glass" className="relative">
                  {chambres.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => supprimerChambre(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold">Chambre {chambre.numero}</h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Numéro</label>
                        <Input
                          value={chambre.numero}
                          onChange={(e) => modifierChambre(index, 'numero', e.target.value)}
                          size="sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Superficie (m²)</label>
                        <Input
                          type="number"
                          value={chambre.superficie.toString()}
                          onChange={(e) => modifierChambre(index, 'superficie', e.target.value)}
                          size="sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Loyer (CFA)</label>
                        <Input
                          type="number"
                          value={chambre.prix.toString()}
                          onChange={(e) => modifierChambre(index, 'prix', e.target.value)}
                          size="sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Niveau</label>
                        <Input
                          type="number"
                          min="1"
                          value={chambre.niveau.toString()}
                          onChange={(e) => modifierChambre(index, 'niveau', e.target.value)}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2">Statut</label>
                      <select
                        value={chambre.statut}
                        onChange={(e) => modifierChambre(index, 'statut', e.target.value)}
                        className="w-full p-2 text-sm border rounded bg-background"
                      >
                        <option value="libre">Libre</option>
                        <option value="occupee">Occupée</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="reservee">Réservée</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2">Équipements spécifiques</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {equipementsDisponibles.slice(0, 8).map((equipement) => (
                          <Badge
                            key={equipement}
                            variant={chambre.equipements.includes(equipement) ? "default" : "outline"}
                            className="cursor-pointer justify-center text-xs py-1"
                            onClick={() => toggleEquipementChambre(index, equipement)}
                          >
                            {equipement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </UltraCard>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description détaillée du bien..."
              rows={4}
              className="w-full p-3 border rounded-lg bg-background resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer le bien'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Annuler
            </Button>
          </div>
        </form>
      </UltraCard>
    </div>
  );
};
