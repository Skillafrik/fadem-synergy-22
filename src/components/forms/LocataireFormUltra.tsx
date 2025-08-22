
import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Save, X, Calendar, Briefcase } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';

interface LocataireFormUltraProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const LocataireFormUltra = ({ onClose, onSuccess }: LocataireFormUltraProps) => {
  const { ajouterLocataire } = useImmobilierUltra();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    profession: '',
    entreprise: '',
    cni: '',
    passeport: '',
    dateNaissance: '',
    situationMatrimoniale: 'celibataire' as 'celibataire' | 'marie' | 'divorce' | 'veuf',
    personnesACharge: 0,
    revenus: 0
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.telephone) {
      toast({
        title: "Erreur",
        description: "Les champs nom, prénom et téléphone sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const locataireData = {
        ...formData,
        dateNaissance: formData.dateNaissance ? new Date(formData.dateNaissance) : new Date(),
        revenus: formData.revenus || undefined
      };

      console.log('[LocataireForm] Tentative d\'ajout locataire:', locataireData);
      const nouveauLocataire = await ajouterLocataire(locataireData);
      console.log('[LocataireForm] Locataire ajouté avec succès:', nouveauLocataire);

      toast({
        title: "Succès",
        description: `Locataire ${formData.nom} ${formData.prenom} ajouté avec succès`,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('[LocataireForm] Erreur ajout locataire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le locataire. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <UltraCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Nouveau Locataire
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <Input
                  required
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Nom de famille"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <Input
                  required
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Téléphone *
                </label>
                <Input
                  required
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </label>
                <Input
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Date de naissance
                </label>
                <Input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Situation matrimoniale</label>
                <select
                  value={formData.situationMatrimoniale}
                  onChange={(e) => handleInputChange('situationMatrimoniale', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf/Veuve</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Informations professionnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profession</label>
                <Input
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="Ex: Ingénieur, Commerçant..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Entreprise</label>
                <Input
                  value={formData.entreprise}
                  onChange={(e) => handleInputChange('entreprise', e.target.value)}
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Revenus mensuels (CFA)</label>
                <Input
                  type="number"
                  value={formData.revenus.toString()}
                  onChange={(e) => handleInputChange('revenus', Number(e.target.value))}
                  placeholder="Revenus en CFA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Personnes à charge</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.personnesACharge.toString()}
                  onChange={(e) => handleInputChange('personnesACharge', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Documents d'identité */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents d'identité</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CNI</label>
                <Input
                  value={formData.cni}
                  onChange={(e) => handleInputChange('cni', e.target.value)}
                  placeholder="Numéro CNI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Passeport</label>
                <Input
                  value={formData.passeport}
                  onChange={(e) => handleInputChange('passeport', e.target.value)}
                  placeholder="Numéro passeport"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer le locataire'}
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
