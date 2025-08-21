
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { resetAllData } from "@/utils/resetAllData";

export const ResetDataButton = () => {
  const handleReset = () => {
    const confirmation = window.confirm(
      "⚠️ ATTENTION ⚠️\n\n" +
      "Cette action va SUPPRIMER DÉFINITIVEMENT toutes les données de l'application :\n" +
      "• Tous les véhicules et leurs contrats\n" +
      "• Tous les biens immobiliers et locataires\n" +
      "• Toutes les transactions comptables\n" +
      "• Tout le personnel et les chantiers BTP\n" +
      "• Tous les rapports générés\n\n" +
      "Cette action est IRRÉVERSIBLE !\n\n" +
      "Êtes-vous absolument certain de vouloir continuer ?"
    );

    if (confirmation) {
      const doubleConfirmation = window.confirm(
        "DERNIÈRE CONFIRMATION\n\n" +
        "Tapez 'SUPPRIMER' dans la prochaine boîte de dialogue pour confirmer définitivement la suppression."
      );

      if (doubleConfirmation) {
        const finalConfirmation = window.prompt(
          "Tapez exactement 'SUPPRIMER' pour confirmer la suppression de toutes les données :"
        );

        if (finalConfirmation === 'SUPPRIMER') {
          resetAllData();
        } else {
          alert("Suppression annulée - texte de confirmation incorrect.");
        }
      }
    }
  };

  return (
    <Card className="p-6 border-destructive bg-destructive/5">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">Zone de danger</h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Cette action supprimera définitivement toutes les données de l'application.
          </p>
          <p className="text-sm font-medium text-destructive">
            ⚠️ Cette action est irréversible !
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={handleReset}
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réinitialiser toute l'application
        </Button>
      </div>
    </Card>
  );
};
