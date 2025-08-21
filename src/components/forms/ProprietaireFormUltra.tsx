
import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Save, X } from 'lucide-react';
import { UltraCard } from '@/components/ui/ultra-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImmobilierUltra } from '@/hooks/useImmobilierUltra';

interface ProprietaireFormUltraProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProprietaireFormUltra = ({ onClose, onSuccess }: ProprietaireFormUltraProps) => {
  const { ajouterProprietaire } = useImmobilierUltra();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    contactPreference: 'telephone' as 'telephone' | 'email' | 'whatsapp',
    comptesBancaires: [''],
    notesPrivees: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ajouterProprietaire(formData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur ajout propriétaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <UltraCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Nouveau Propriétaire
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <Input
                required
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Nom de famille"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prénom *</label>
              <Input
                required
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Prénom"
                className="w-full"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full"
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
                placeholder="email@example.com"
                className="w-full"
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Adresse complète *
            </label>
            <Input
              required
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              placeholder="Adresse complète du propriétaire"
              className="w-full"
            />
          </div>

          {/* Préférence de contact */}
          <div>
            <label className="block text-sm font-medium mb-2">Préférence de contact</label>
            <select
              value={formData.contactPreference}
              onChange={(e) => handleInputChange('contactPreference', e.target.value)}
              className="w-full p-3 border rounded-lg bg-background"
            >
              <option value="telephone">Téléphone</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          {/* Compte bancaire */}
          <div>
            <label className="block text-sm font-medium mb-2">Compte bancaire principal</label>
            <Input
              value={formData.comptesBancaires[0]}
              onChange={(e) => {
                const nouveauxComptes = [...formData.comptesBancaires];
                nouveauxComptes[0] = e.target.value;
                setFormData(prev => ({ ...prev, comptesBancaires: nouveauxComptes }));
              }}
              placeholder="Numéro de compte ou IBAN"
              className="w-full"
            />
          </div>

          {/* Notes privées */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes privées</label>
            <textarea
              value={formData.notesPrivees}
              onChange={(e) => handleInputChange('notesPrivees', e.target.value)}
              placeholder="Notes internes sur ce propriétaire..."
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
              {loading ? 'Enregistrement...' : 'Enregistrer'}
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
