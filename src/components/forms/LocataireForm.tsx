
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    entreprise: locataire?.entreprise || '',
    cni: locataire?.cni || '',
    passeport: locataire?.passeport || '',
    dateNaissance: locataire?.dateNaissance ? locataire.dateNaissance.toISOString().split('T')[0] : '',
    situationMatrimoniale: locataire?.situationMatrimoniale || '',
    personnesACharge: locataire?.personnesACharge || 0,
    revenus: locataire?.revenus || 0,
    documentsSupplementaires: locataire?.documentsSupplementaires ? locataire.documentsSupplementaires.join('\n') : ''
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
    if (!formData.profession.trim()) newErrors.profession = 'La profession est requise';
    if (!formData.cni.trim()) newErrors.cni = 'La CNI est requise';
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
    if (!formData.situationMatrimoniale.trim()) newErrors.situationMatrimoniale = 'La situation matrimoniale est requise';

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
      profession: formData.profession.trim(),
      entreprise: formData.entreprise.trim() || undefined,
      cni: formData.cni.trim(),
      passeport: formData.passeport.trim() || undefined,
      dateNaissance: new Date(formData.dateNaissance),
      situationMatrimoniale: formData.situationMatrimoniale.trim(),
      personnesACharge: formData.personnesACharge,
      revenus: formData.revenus || undefined,
      documentsSupplementaires: formData.documentsSupplementaires.trim() ? 
        formData.documentsSupplementaires.split('\n').filter(d => d.trim()) : undefined
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
            <Label htmlFor="passeport">Passeport</Label>
            <Input
              id="passeport"
              value={formData.passeport}
              onChange={(e) => handleChange('passeport', e.target.value)}
              placeholder="Numéro de passeport"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance *</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange('dateNaissance', e.target.value)}
            />
            {errors.dateNaissance && <p className="text-sm text-destructive">{errors.dateNaissance}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="situationMatrimoniale">Situation matrimoniale *</Label>
            <Select value={formData.situationMatrimoniale} onValueChange={(value) => handleChange('situationMatrimoniale', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celibataire">Célibataire</SelectItem>
                <SelectItem value="marie">Marié(e)</SelectItem>
                <SelectItem value="divorce">Divorcé(e)</SelectItem>
                <SelectItem value="veuf">Veuf(ve)</SelectItem>
              </SelectContent>
            </Select>
            {errors.situationMatrimoniale && <p className="text-sm text-destructive">{errors.situationMatrimoniale}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              placeholder="Profession du locataire"
            />
            {errors.profession && <p className="text-sm text-destructive">{errors.profession}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entreprise">Entreprise</Label>
            <Input
              id="entreprise"
              value={formData.entreprise}
              onChange={(e) => handleChange('entreprise', e.target.value)}
              placeholder="Nom de l'entreprise"
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
          <Label htmlFor="documentsSupplementaires">Documents supplémentaires</Label>
          <Textarea
            id="documentsSupplementaires"
            value={formData.documentsSupplementaires}
            onChange={(e) => handleChange('documentsSupplementaires', e.target.value)}
            placeholder="Un document par ligne"
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
