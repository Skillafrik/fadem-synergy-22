
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Contrat, Bien, Locataire } from '@/types';

interface ContratFormProps {
  contrat?: Contrat;
  biens: Bien[];
  locataires: Locataire[];
  onSubmit: (data: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures'>) => void;
  onCancel: () => void;
}

export const ContratForm = ({ contrat, biens, locataires, onSubmit, onCancel }: ContratFormProps) => {
  const biensDisponibles = biens.filter(b => b.statut === 'disponible' || b.id === contrat?.bienId);
  
  const [formData, setFormData] = useState({
    bienId: contrat?.bienId || '',
    locataireId: contrat?.locataireId || '',
    dateDebut: contrat?.dateDebut ? contrat.dateDebut.toISOString().split('T')[0] : '',
    dateFin: contrat?.dateFin ? contrat.dateFin.toISOString().split('T')[0] : '',
    loyerMensuel: contrat?.loyerMensuel || 0,
    caution: contrat?.caution || 0,
    charges: contrat?.charges || 0,
    statut: contrat?.statut || 'actif' as const,
    conditions: contrat?.conditions || '',
    observations: contrat?.observations || ''
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

    if (!formData.bienId) newErrors.bienId = 'Le bien est requis';
    if (!formData.locataireId) newErrors.locataireId = 'Le locataire est requis';
    if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.dateFin) newErrors.dateFin = 'La date de fin est requise';
    if (formData.loyerMensuel <= 0) newErrors.loyerMensuel = 'Le loyer mensuel doit être supérieur à 0';
    if (formData.caution < 0) newErrors.caution = 'La caution ne peut pas être négative';

    // Validation des dates
    if (formData.dateDebut && formData.dateFin) {
      const debut = new Date(formData.dateDebut);
      const fin = new Date(formData.dateFin);
      if (fin <= debut) {
        newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      bienId: formData.bienId,
      locataireId: formData.locataireId,
      dateDebut: new Date(formData.dateDebut),
      dateFin: new Date(formData.dateFin),
      loyerMensuel: formData.loyerMensuel,
      caution: formData.caution,
      charges: formData.charges,
      statut: formData.statut,
      conditions: formData.conditions.trim() || undefined,
      observations: formData.observations.trim() || undefined
    });
  };

  const selectedBien = biens.find(b => b.id === formData.bienId);
  const selectedLocataire = locataires.find(l => l.id === formData.locataireId);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {contrat ? 'Modifier le Contrat' : 'Nouveau Contrat de Location'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bienId">Bien à louer *</Label>
            <Select value={formData.bienId} onValueChange={(value) => handleChange('bienId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {biensDisponibles.map(bien => (
                  <SelectItem key={bien.id} value={bien.id}>
                    {bien.type} - {bien.quartier} ({bien.adresse})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bienId && <p className="text-sm text-destructive">{errors.bienId}</p>}
            {selectedBien && (
              <div className="text-sm text-muted-foreground">
                Prix suggéré: {selectedBien.prixFadem.toLocaleString()} CFA/mois
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locataireId">Locataire *</Label>
            <Select value={formData.locataireId} onValueChange={(value) => handleChange('locataireId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {locataires.map(locataire => (
                  <SelectItem key={locataire.id} value={locataire.id}>
                    {locataire.nom} {locataire.prenom} - {locataire.telephone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.locataireId && <p className="text-sm text-destructive">{errors.locataireId}</p>}
            {selectedLocataire && (
              <div className="text-sm text-muted-foreground">
                Revenus: {selectedLocataire.revenus?.toLocaleString()} CFA/mois
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateDebut">Date de début *</Label>
            <Input
              id="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={(e) => handleChange('dateDebut', e.target.value)}
            />
            {errors.dateDebut && <p className="text-sm text-destructive">{errors.dateDebut}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFin">Date de fin *</Label>
            <Input
              id="dateFin"
              type="date"
              value={formData.dateFin}
              onChange={(e) => handleChange('dateFin', e.target.value)}
            />
            {errors.dateFin && <p className="text-sm text-destructive">{errors.dateFin}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="loyerMensuel">Loyer mensuel (CFA) *</Label>
            <Input
              id="loyerMensuel"
              type="number"
              value={formData.loyerMensuel}
              onChange={(e) => handleChange('loyerMensuel', Number(e.target.value))}
              placeholder="0"
            />
            {errors.loyerMensuel && <p className="text-sm text-destructive">{errors.loyerMensuel}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caution">Caution (CFA)</Label>
            <Input
              id="caution"
              type="number"
              value={formData.caution}
              onChange={(e) => handleChange('caution', Number(e.target.value))}
              placeholder="0"
            />
            {errors.caution && <p className="text-sm text-destructive">{errors.caution}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="charges">Charges mensuelles (CFA)</Label>
            <Input
              id="charges"
              type="number"
              value={formData.charges}
              onChange={(e) => handleChange('charges', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
                <SelectItem value="resilié">Résilié</SelectItem>
                <SelectItem value="expire">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conditions">Conditions particulières</Label>
          <Textarea
            id="conditions"
            value={formData.conditions}
            onChange={(e) => handleChange('conditions', e.target.value)}
            placeholder="Conditions spécifiques du contrat"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations">Observations</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Observations diverses"
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
            {contrat ? 'Modifier' : 'Créer le contrat'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
