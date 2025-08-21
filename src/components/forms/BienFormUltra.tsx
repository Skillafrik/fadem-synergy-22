
import React, { useState } from 'react';
import { Home, MapPin, Camera, Plus, Save, X, Building } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';
import { Chambre } from '@/types/immobilier-unifie';

interface BienFormUltraProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const BienFormUltra = ({ onClose, onSuccess }: BienFormUltraProps) => {
  const { proprietaires, ajouterBien } = useImmobilierUltra();
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
    coordonnees: { latitude: 4.0511, longitude: 9.7679 } // Douala par défaut
  });

  const [chambres, setChambres] = useState<Omit<Chambre, 'statut' | 'niveau'>[]>([
    {
      numero: '01',
      superficie: 12,
      prix: 35000,
      equipements: [],
      photos: [],
      description: ''
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [equipementInput, setEquipementInput] = useState('');

  const equipementsCommuns = [
    'Climatisation', 'Ventilateur', 'Eau courante', 'Électricité', 
    'Internet', 'Parking', 'Sécurité', 'Jardin', 'Balcon', 'Cuisine équipée'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proprietaireId) return;

    setLoading(true);

    try {
      const chambresComplete = chambres.map((chambre, index) => ({
        ...chambre,
        statut: 'libre' as const,
        niveau: Math.floor(index / 4) + 1 // 4 chambres par étage max
      }));

      await ajouterBien({
        ...formData,
        nbrChambres: chambres.length,
        chambres: chambresComplete,
        photos: {
          facade: [],
          chambres: {},
          communs: []
        }
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur ajout bien:', error);
    } finally {
      setLoading(false);
    }
  };

  const ajouterChambre = () => {
    setChambres(prev => [
      ...prev,
      {
        numero: String(prev.length + 1).padStart(2, '0'),
        superficie: 12,
        prix: 35000,
        equipements: [],
        photos: [],
        description: ''
      }
    ]);
  };

  const supprimerChambre = (index: number) => {
    if (chambres.length > 1) {
      setChambres(prev => prev.filter((_, i) => i !== index));
    }
  };

  const modifierChambre = (index: number, field: string, value: any) => {
    setChambres(prev => prev.map((chambre, i) => 
      i === index ? { ...chambre, [field]: value } : chambre
    ));
  };

  const ajouterEquipement = () => {
    if (equipementInput.trim() && !formData.equipements.includes(equipementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        equipements: [...prev.equipements, equipementInput.trim()]
      }));
      setEquipementInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <UltraCard className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6 text-primary" />
            Nouveau Bien Immobilier
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection du propriétaire */}
          <div>
            <label className="block text-sm font-medium mb-2">Propriétaire *</label>
            <select
              required
              value={formData.proprietaireId}
              onChange={(e) => setFormData(prev => ({ ...prev, proprietaireId: e.target.value }))}
              className="w-full p-3 border rounded-lg bg-background"
            >
              <option value="">Sélectionner un propriétaire</option>
              {proprietaires.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.nom} {prop.prenom} - {prop.telephone}
                </option>
              ))}
            </select>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de bien *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: Résidence Belle Vue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prix FADEM (CFA)</label>
              <Input
                type="number"
                value={formData.prixFadem}
                onChange={(e) => setFormData(prev => ({ ...prev, prixFadem: Number(e.target.value) }))}
                placeholder="Prix d'achat/estimation"
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Adresse complète *
              </label>
              <Input
                required
                value={formData.adresse}
                onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                placeholder="Adresse précise du bien"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quartier *</label>
              <Input
                required
                value={formData.quartier}
                onChange={(e) => setFormData(prev => ({ ...prev, quartier: e.target.value }))}
                placeholder="Nom du quartier"
              />
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Superficie (m²)</label>
              <Input
                type="number"
                value={formData.superficie}
                onChange={(e) => setFormData(prev => ({ ...prev, superficie: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre d'étages</label>
              <Input
                type="number"
                min="1"
                value={formData.etages}
                onChange={(e) => setFormData(prev => ({ ...prev, etages: Number(e.target.value) }))}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Ville</label>
              <Input
                value={formData.ville}
                onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
              />
            </div>
          </div>

          {/* Équipements */}
          <div>
            <label className="block text-sm font-medium mb-2">Équipements du bien</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={equipementInput}
                onChange={(e) => setEquipementInput(e.target.value)}
                placeholder="Ajouter un équipement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), ajouterEquipement())}
              />
              <Button type="button" onClick={ajouterEquipement} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {equipementsCommuns.map(equip => (
                <Badge
                  key={equip}
                  variant={formData.equipements.includes(equip) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (formData.equipements.includes(equip)) {
                      setFormData(prev => ({
                        ...prev,
                        equipements: prev.equipements.filter(e => e !== equip)
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        equipements: [...prev.equipements, equip]
                      }));
                    }
                  }}
                >
                  {equip}
                </Badge>
              ))}
            </div>

            {formData.equipements.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.equipements.map(equip => (
                  <Badge key={equip} variant="secondary" className="text-xs">
                    {equip}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Configuration des chambres */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Configuration des chambres</h3>
              <Button type="button" onClick={ajouterChambre} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter chambre
              </Button>
            </div>

            <div className="space-y-4">
              {chambres.map((chambre, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Chambre {chambre.numero}</h4>
                    {chambres.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerChambre(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                        value={chambre.superficie}
                        onChange={(e) => modifierChambre(index, 'superficie', Number(e.target.value) || 0)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Loyer (CFA)</label>
                      <Input
                        type="number"
                        value={chambre.prix}
                        onChange={(e) => modifierChambre(index, 'prix', Number(e.target.value) || 0)}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée du bien..."
              rows={3}
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
