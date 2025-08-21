
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
  onSubmit: (data: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures' | 'proprietaireId'>) => void;
  onCancel: () => void;
}

export const ContratForm = ({ contrat, biens, locataires, onSubmit, onCancel }: ContratFormProps) => {
  const biensDisponibles = biens.filter(b => b.statut === 'disponible' || b.id === contrat?.bienId);
  
  const [formData, setFormData] = useState({
    bienId: contrat?.bienId || '',
    locataireId: contrat?.locataireId || '',
    type: contrat?.type || 'location' as const,
    dateDebut: contrat?.dateDebut ? contrat.dateDebut.toISOString().split('T')[0] : '',
    dateFin: contrat?.dateFin ? contrat.dateFin.toISOString().split('T')[0] : '',
    duree: contrat?.duree || 12,
    montantMensuel: contrat?.montantMensuel || 0,
    caution: contrat?.caution || 0,
    avance: contrat?.avance || 0,
    statut: contrat?.statut || 'actif' as const,
    clausesSpeciales: contrat?.clausesSpeciales ? contrat.clausesSpeciales.join('\n') : ''
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
    if (formData.duree <= 0) newErrors.duree = 'La durée doit être supérieure à 0';
    if (formData.montantMensuel <= 0) newErrors.montantMensuel = 'Le montant mensuel doit être supérieur à 0';
    if (formData.caution < 0) newErrors.caution = 'La caution ne peut pas être négative';

    // Validation des dates si dateFin est fournie
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

    const selectedBien = biens.find(b => b.id === formData.bienId);
    
    onSubmit({
      bienId: formData.bienId,
      locataireId: formData.locataireId,
      type: formData.type,
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      duree: formData.duree,
      montantMensuel: formData.montantMensuel,
      caution: formData.caution,
      avance: formData.avance || undefined,
      statut: formData.statut,
      clausesSpeciales: formData.clausesSpeciales.trim() ? formData.clausesSpeciales.split('\n').filter(c => c.trim()) : undefined
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
            <Label htmlFor="type">Type de contrat</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="vente">Vente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duree">Durée (mois) *</Label>
            <Input
              id="duree"
              type="number"
              value={formData.duree}
              onChange={(e) => handleChange('duree', Number(e.target.value))}
              placeholder="12"
            />
            {errors.duree && <p className="text-sm text-destructive">{errors.duree}</p>}
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
            <Label htmlFor="dateFin">Date de fin</Label>
            <Input
              id="dateFin"
              type="date"
              value={formData.dateFin}
              onChange={(e) => handleChange('dateFin', e.target.value)}
            />
            {errors.dateFin && <p className="text-sm text-destructive">{errors.dateFin}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="montantMensuel">Montant mensuel (CFA) *</Label>
            <Input
              id="montantMensuel"
              type="number"
              value={formData.montantMensuel}
              onChange={(e) => handleChange('montantMensuel', Number(e.target.value))}
              placeholder="0"
            />
            {errors.montantMensuel && <p className="text-sm text-destructive">{errors.montantMensuel}</p>}
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
            <Label htmlFor="avance">Avance (CFA)</Label>
            <Input
              id="avance"
              type="number"
              value={formData.avance}
              onChange={(e) => handleChange('avance', Number(e.target.value))}
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
          <Label htmlFor="clausesSpeciales">Clauses spéciales</Label>
          <Textarea
            id="clausesSpeciales"
            value={formData.clausesSpeciales}
            onChange={(e) => handleChange('clausesSpeciales', e.target.value)}
            placeholder="Une clause par ligne"
            rows={3}
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
