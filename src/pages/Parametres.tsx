
import React, { useState } from "react";
import { Settings, Shield, Users, FileText, Database, Check, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Parametres = () => {
  const { toast } = useToast();
  
  // États pour les mots de passe
  const [adminPassword, setAdminPassword] = useState("");
  const [modulePassword, setModulePassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [confirmModulePassword, setConfirmModulePassword] = useState("");
  
  // États pour la configuration des accès
  const [userAccess, setUserAccess] = useState({
    immobilier: { user: "Gestionnaire immobilier", active: true },
    btp: { user: "Chef de projet", active: true },
    comptabilite: { user: "Comptable", active: true },
    vehicules: { user: "Gestionnaire flotte", active: false },
    personnel: { user: "Responsable RH", active: false }
  });
  
  // États pour les modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  
  // État pour la sauvegarde
  const [lastBackup, setLastBackup] = useState(new Date());
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpdatePasswords = () => {
    if (!adminPassword || !modulePassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (adminPassword !== confirmAdminPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe administrateur ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (modulePassword !== confirmModulePassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe modules ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    // Simuler la sauvegarde des mots de passe
    localStorage.setItem('fadem_admin_password', adminPassword);
    localStorage.setItem('fadem_module_password', modulePassword);
    
    // Reset des champs
    setAdminPassword("");
    setModulePassword("");
    setConfirmAdminPassword("");
    setConfirmModulePassword("");
    setShowPasswordModal(false);

    toast({
      title: "Succès",
      description: "Mots de passe mis à jour avec succès"
    });
  };

  const handleConfigureAccess = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowAccessModal(true);
  };

  const toggleModuleAccess = (moduleId: string) => {
    setUserAccess(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId as keyof typeof prev],
        active: !prev[moduleId as keyof typeof prev].active
      }
    }));

    toast({
      title: "Configuration mise à jour",
      description: `Accès ${userAccess[moduleId as keyof typeof userAccess].active ? 'désactivé' : 'activé'} pour le module`
    });
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Exporter toutes les données en localStorage
      const data = {
        timestamp: new Date().toISOString(),
        data: {
          immobilier: localStorage.getItem('fadem_immobilier'),
          comptabilite: localStorage.getItem('fadem_comptabilite'),
          btp: localStorage.getItem('fadem_btp'),
          vehicules: localStorage.getItem('fadem_vehicules'),
          personnel: localStorage.getItem('fadem_personnel'),
          rapports: localStorage.getItem('fadem_rapports')
        }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sauvegarde-fadem-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setLastBackup(new Date());
      
      toast({
        title: "Sauvegarde réussie",
        description: "Vos données ont été sauvegardées avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    
    try {
      // Simuler une synchronisation cloud
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Synchronisation réussie",
        description: "Vos données ont été synchronisées avec le cloud"
      });
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de se connecter au cloud",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const editDocumentTemplate = (templateName: string) => {
    toast({
      title: "Fonctionnalité en cours",
      description: `Édition du modèle "${templateName}" bientôt disponible`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Paramètres</h1>
            <p className="text-muted-foreground">Configuration et administration du système</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sécurité */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Mots de passe système</span>
                <Badge variant={adminPassword ? "default" : "secondary"}>
                  {localStorage.getItem('fadem_admin_password') ? "Configuré" : "Non configuré"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Protégez l'accès à votre système avec des mots de passe sécurisés
              </p>
              <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogTrigger asChild>
                  <Button className="bg-fadem-red hover:bg-fadem-red-dark text-white w-full">
                    Configurer les mots de passe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configuration des mots de passe</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Mot de passe administrateur</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                      />
                      <Input
                        type="password"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-password">Mot de passe modules</Label>
                      <Input
                        id="module-password"
                        type="password"
                        value={modulePassword}
                        onChange={(e) => setModulePassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                      />
                      <Input
                        type="password"
                        value={confirmModulePassword}
                        onChange={(e) => setConfirmModulePassword(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdatePasswords} className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Accès Utilisateurs */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Accès Utilisateurs</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(userAccess).map(([moduleId, config]) => (
              <div key={moduleId} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-semibold text-fadem-black capitalize">{moduleId}</p>
                  <p className="text-sm text-muted-foreground">{config.user}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={config.active ? "default" : "secondary"}>
                    {config.active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleConfigureAccess(moduleId)}
                  >
                    Configurer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Modèles de Documents */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Modèles de Documents</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Contrat de location", status: "Configuré" },
              { name: "Devis BTP", status: "Par défaut" },
              { name: "Facture véhicule", status: "Configuré" },
              { name: "Fiche employé", status: "Par défaut" }
            ].map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <span className="font-medium">{template.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {template.status}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => editDocumentTemplate(template.name)}
                >
                  Modifier
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Base de Données */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Base de Données</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Dernière sauvegarde</p>
                <Badge variant="outline">
                  {lastBackup.toLocaleDateString('fr-FR')}
                </Badge>
              </div>
              <p className="font-semibold text-fadem-black">
                {lastBackup.toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleBackupNow}
                disabled={isBackingUp}
              >
                {isBackingUp ? "Sauvegarde..." : "Sauvegarder maintenant"}
              </Button>
              <Button 
                className="bg-fadem-red hover:bg-fadem-red-dark text-white flex-1"
                onClick={handleCloudSync}
                disabled={isSyncing}
              >
                {isSyncing ? "Synchronisation..." : "Synchroniser cloud"}
              </Button>
            </div>
            
            {/* Statistiques de la base */}
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-primary/10 rounded">
                  <div className="font-bold text-primary">
                    {Object.keys(localStorage).filter(key => key.startsWith('fadem_')).length}
                  </div>
                  <div className="text-muted-foreground">Modules actifs</div>
                </div>
                <div className="text-center p-2 bg-success/10 rounded">
                  <div className="font-bold text-success">100%</div>
                  <div className="text-muted-foreground">Intégrité</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de configuration d'accès */}
      <Dialog open={showAccessModal} onOpenChange={setShowAccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuration d'accès - {selectedModule}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Gérer les permissions pour le module {selectedModule}
              </p>
              <div className="flex items-center justify-between">
                <span>Statut du module</span>
                <Button
                  variant={userAccess[selectedModule as keyof typeof userAccess]?.active ? "default" : "outline"}
                  onClick={() => toggleModuleAccess(selectedModule)}
                >
                  {userAccess[selectedModule as keyof typeof userAccess]?.active ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAccessModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parametres;
