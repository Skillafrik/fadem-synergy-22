
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Locataire } from '@/types';

interface LocataireFormProps {
  locataire?: Locataire;
  onSubmit: (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => void;
  onCancel: () => void;
}

export const LocataireForm = ({ locataire, onSubmit, onCancel }: LocataireFormProps) => {
  const [formData, setFormData] = useState({
    nom: locataire?.nom || '',
    prenom: locataire?.prenom || '',
    telephone: locataire?.telephone || '',
    email: locataire?.email || '',
    adresse: locataire?.adresse || '',
    profession: locataire?.profession || '',
    cni: locataire?.cni || '',
    revenus: locataire?.revenus || 0,
    personnesACharge: locataire?.personnesACharge || 0,
    references: locataire?.references || '',
    commentaires: locataire?.commentaires || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.cni.trim()) newErrors.cni = 'La CNI est requise';

    // Validation du format téléphone
    if (formData.telephone && !/^\d{8,}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    // Validation de l'email si fourni
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      telephone: formData.telephone.trim(),
      email: formData.email.trim() || undefined,
      adresse: formData.adresse.trim(),
      profession: formData.profession.trim() || undefined,
      cni: formData.cni.trim(),
      revenus: formData.revenus,
      personnesACharge: formData.personnesACharge,
      references: formData.references.trim() || undefined,
      commentaires: formData.commentaires.trim() || undefined
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {locataire ? 'Modifier le Locataire' : 'Nouveau Locataire'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Nom de famille"
            />
            {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              placeholder="Prénom"
            />
            {errors.prenom && <p className="text-sm text-destructive">{errors.prenom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="Ex: 90123456"
            />
            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemple.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cni">CNI *</Label>
            <Input
              id="cni"
              value={formData.cni}
              onChange={(e) => handleChange('cni', e.target.value)}
              placeholder="Numéro CNI"
            />
            {errors.cni && <p className="text-sm text-destructive">{errors.cni}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              placeholder="Profession du locataire"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenus">Revenus mensuels (CFA)</Label>
            <Input
              id="revenus"
              type="number"
              value={formData.revenus}
              onChange={(e) => handleChange('revenus', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnesACharge">Personnes à charge</Label>
            <Input
              id="personnesACharge"
              type="number"
              value={formData.personnesACharge}
              onChange={(e) => handleChange('personnesACharge', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Textarea
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange('adresse', e.target.value)}
            placeholder="Adresse complète"
            rows={2}
          />
          {errors.adresse && <p className="text-sm text-destructive">{errors.adresse}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="references">Références</Label>
          <Textarea
            id="references"
            value={formData.references}
            onChange={(e) => handleChange('references', e.target.value)}
            placeholder="Références professionnelles ou personnelles"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commentaires">Commentaires</Label>
          <Textarea
            id="commentaires"
            value={formData.commentaires}
            onChange={(e) => handleChange('commentaires', e.target.value)}
            placeholder="Commentaires additionnels"
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit"
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {locataire ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
