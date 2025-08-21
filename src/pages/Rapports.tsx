import React, { useState } from "react";
import { BarChart3, FileText, Download, Calendar, Filter, Plus, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useRapports } from "@/hooks/useRapports";
import { useComptabilite } from "@/hooks/useComptabilite";
import { pdfGenerator } from "@/utils/pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Rapports = () => {
  const { 
    genererRapportJournalier, 
    creerRapportPersonnalise,
    obtenirRapportsRecents,
    obtenirStatistiques 
  } = useRapports();
  
  const { obtenirStatistiquesJour, obtenirStatistiquesMois } = useComptabilite();
  const { toast } = useToast();
  
  const [dateSelectionnee, setDateSelectionnee] = useState<Date | undefined>(new Date());
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();
  const [modulesSelectionnes, setModulesSelectionnes] = useState<string[]>([]);
  const [metriquesSelectionnees, setMetriquesSelectionnees] = useState<string[]>(['revenus', 'depenses', 'benefices']);
  const [titreRapport, setTitreRapport] = useState('');
  const [showPersonnaliseForm, setShowPersonnaliseForm] = useState(false);

  const statsJour = obtenirStatistiquesJour();
  const statsMois = obtenirStatistiquesMois();
  const rapportsRecents = obtenirRapportsRecents(5);
  const statsRapports = obtenirStatistiques();

  const modules = [
    { id: 'immobilier', label: 'Immobilier' },
    { id: 'btp', label: 'BTP' },
    { id: 'vehicules', label: 'Véhicules' },
    { id: 'personnel', label: 'Personnel' }
  ];

  const metriques = [
    { id: 'revenus', label: 'Revenus' },
    { id: 'depenses', label: 'Dépenses' },
    { id: 'benefices', label: 'Bénéfices' },
    { id: 'transactions', label: 'Nombre de transactions' },
    { id: 'evolution', label: 'Évolution par rapport à la période précédente' }
  ];

  const genererRapportQuotidien = async () => {
    if (!dateSelectionnee) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }

    try {
      const rapport = genererRapportJournalier(dateSelectionnee);
      const blob = await pdfGenerator.genererRapportJournalier(rapport);
      
      // Télécharger le PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-quotidien-${format(dateSelectionnee, 'yyyy-MM-dd')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Rapport quotidien généré et téléchargé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  const genererRapportMensuel = async () => {
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);

    try {
      const rapport = creerRapportPersonnalise({
        titre: `Rapport Mensuel - ${format(maintenant, 'MMMM yyyy', { locale: fr })}`,
        dateDebut: debutMois,
        dateFin: finMois,
        modules: [],
        metriques: ['revenus', 'depenses', 'benefices', 'evolution'],
        description: 'Rapport automatique mensuel',
        donnees: {} // This will be calculated by the hook
      });

      const blob = await pdfGenerator.genererRapportPersonnalise({
        titre: rapport.titre,
        periode: `Du ${format(debutMois, 'dd/MM/yyyy')} au ${format(finMois, 'dd/MM/yyyy')}`,
        dateGeneration: rapport.dateGeneration,
        donnees: rapport.donnees,
        type: 'mensuel'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-mensuel-${format(maintenant, 'yyyy-MM')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Rapport mensuel généré et téléchargé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  const creerRapportPersonnaliseHandler = async () => {
    if (!dateDebut || !dateFin || !titreRapport) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    try {
      const rapport = creerRapportPersonnalise({
        titre: titreRapport,
        dateDebut,
        dateFin,
        modules: modulesSelectionnes,
        metriques: metriquesSelectionnees,
        description: `Rapport personnalisé du ${format(dateDebut, 'dd/MM/yyyy')} au ${format(dateFin, 'dd/MM/yyyy')}`,
        donnees: {} // This will be calculated by the hook
      });

      const blob = await pdfGenerator.genererRapportPersonnalise({
        titre: rapport.titre,
        periode: `Du ${format(dateDebut, 'dd/MM/yyyy')} au ${format(dateFin, 'dd/MM/yyyy')}`,
        dateGeneration: rapport.dateGeneration,
        donnees: rapport.donnees,
        type: 'personnalise'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${titreRapport.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setShowPersonnaliseForm(false);
      setTitreRapport('');
      setDateDebut(undefined);
      setDateFin(undefined);

      toast({
        title: "Succès",
        description: "Rapport personnalisé créé et téléchargé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du rapport",
        variant: "destructive"
      });
    }
  };

  const toggleModule = (moduleId: string) => {
    setModulesSelectionnes(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleMetrique = (metriqueId: string) => {
    setMetriquesSelectionnees(prev =>
      prev.includes(metriqueId)
        ? prev.filter(id => id !== metriqueId)
        : [...prev, metriqueId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg text-white">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Module Rapports</h1>
            <p className="text-muted-foreground">Tableaux de bord et analyses dynamiques</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowPersonnaliseForm(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Plus size={20} className="mr-2" />
          Rapport Personnalisé
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-success/20 bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-success">Revenus Aujourd'hui</h3>
              <p className="text-2xl font-bold text-success mt-2">
                {statsJour.revenus.toLocaleString()} CFA
              </p>
            </div>
            <TrendingUp className="text-success" size={24} />
          </div>
        </Card>
        
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-destructive">Dépenses Aujourd'hui</h3>
              <p className="text-2xl font-bold text-destructive mt-2">
                {statsJour.depenses.toLocaleString()} CFA
              </p>
            </div>
            <DollarSign className="text-destructive" size={24} />
          </div>
        </Card>
        
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">Bénéfices Net</h3>
              <p className="text-2xl font-bold text-primary mt-2">
                {(statsJour.revenus - statsJour.depenses).toLocaleString()} CFA
              </p>
            </div>
            <BarChart3 className="text-primary" size={24} />
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold">Rapports Générés</h3>
          <p className="text-2xl font-bold mt-2 text-foreground">
            {statsRapports.rapportsGeneres}
          </p>
        </Card>
      </div>

      {/* Rapports prédéfinis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Rapport Quotidien</h3>
            <Button size="sm" variant="outline" onClick={genererRapportQuotidien}>
              <Download size={16} className="mr-1" />
              PDF
            </Button>
          </div>
          
          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateSelectionnee && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateSelectionnee ? format(dateSelectionnee, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateSelectionnee}
                  onSelect={setDateSelectionnee}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Revenus:</span>
                <span className="font-semibold text-success">{statsJour.revenus.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between">
                <span>Dépenses:</span>
                <span className="font-semibold text-destructive">{statsJour.depenses.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between">
                <span>Net:</span>
                <span className="font-semibold text-primary">
                  {(statsJour.revenus - statsJour.depenses).toLocaleString()} CFA
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Rapport Mensuel</h3>
            <Button size="sm" variant="outline" onClick={genererRapportMensuel}>
              <Download size={16} className="mr-1" />
              PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Performance de {format(new Date(), 'MMMM yyyy', { locale: fr })}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>CA Total:</span>
              <span className="font-semibold text-success">{statsMois.revenus.toLocaleString()} CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Dépenses:</span>
              <span className="font-semibold text-destructive">{statsMois.depenses.toLocaleString()} CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Bénéfices:</span>
              <span className="font-semibold text-primary">
                {(statsMois.revenus - statsMois.depenses).toLocaleString()} CFA
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Rapport Personnalisé</h3>
            <Button 
              size="sm" 
              onClick={() => setShowPersonnaliseForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus size={16} className="mr-1" />
              Créer
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Générer un rapport sur mesure
          </p>
          <div className="space-y-2 text-sm">
            <p>• Période personnalisée</p>
            <p>• Modules sélectionnés</p>
            <p>• Métriques spécifiques</p>
            <p>• Export PDF automatique</p>
          </div>
        </Card>
      </div>

      {/* Formulaire rapport personnalisé */}
      {showPersonnaliseForm && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Créer un Rapport Personnalisé</h2>
            <Button variant="ghost" onClick={() => setShowPersonnaliseForm(false)}>
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre du rapport *</label>
                <Input
                  value={titreRapport}
                  onChange={(e) => setTitreRapport(e.target.value)}
                  placeholder="Ex: Rapport de performance Q1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date de début *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateDebut && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateDebut ? format(dateDebut, "dd/MM/yyyy") : "Date début"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateDebut}
                        onSelect={setDateDebut}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date de fin *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFin && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFin ? format(dateFin, "dd/MM/yyyy") : "Date fin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFin}
                        onSelect={setDateFin}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Modules (optionnel)</label>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={module.id}
                        checked={modulesSelectionnes.includes(module.id)}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                      <label htmlFor={module.id} className="text-sm">
                        {module.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Métriques *</label>
                <div className="space-y-2">
                  {metriques.map((metrique) => (
                    <div key={metrique.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={metrique.id}
                        checked={metriquesSelectionnees.includes(metrique.id)}
                        onCheckedChange={() => toggleMetrique(metrique.id)}
                      />
                      <label htmlFor={metrique.id} className="text-sm">
                        {metrique.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowPersonnaliseForm(false)}>
              Annuler
            </Button>
            <Button onClick={creerRapportPersonnaliseHandler}>
              <FileText className="w-4 h-4 mr-2" />
              Créer et Télécharger
            </Button>
          </div>
        </Card>
      )}

      {/* Historique des rapports */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Historique des Rapports</h2>
        <div className="space-y-3">
          {rapportsRecents.length > 0 ? (
            rapportsRecents.map((rapport: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <h3 className="font-semibold">
                      {rapport.titre || `Rapport ${rapport.type}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Généré le {format(new Date(rapport.dateGeneration), 'dd/MM/yyyy à HH:mm')}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {rapport.type}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun rapport généré pour le moment</p>
              <p className="text-sm">Créez votre premier rapport pour commencer</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Rapports;
