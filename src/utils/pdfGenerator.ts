
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface RapportData {
  titre: string;
  periode: string;
  dateGeneration: Date;
  donnees: any;
  type: 'journalier' | 'mensuel' | 'personnalise';
}

export class PDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  private addHeader() {
    // Logo et en-tête GROUPE FADEM
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(220, 38, 38); // Rouge FADEM
    this.pdf.text('GROUPE FADEM', 20, 30);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Gestion Immobilière • BTP • Véhicules • Personnel', 20, 40);
    
    // Ligne de séparation
    this.pdf.setDrawColor(220, 38, 38);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, 45, 190, 45);
  }

  private addFooter() {
    const pageHeight = this.pdf.internal.pageSize.height;
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    
    // Date de génération
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    this.pdf.text(`Généré le ${dateStr}`, 20, pageHeight - 20);
    this.pdf.text('2025 GROUPE FADEM - Tous droits réservés', 20, pageHeight - 10);
    
    // Numéro de page
    const pageCount = this.pdf.getNumberOfPages();
    this.pdf.text(`Page ${pageCount}`, 170, pageHeight - 10);
  }

  async genererRapportJournalier(data: any): Promise<Blob> {
    this.addHeader();
    
    let yPos = 60;
    
    // Titre du rapport
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Rapport Quotidien', 20, yPos);
    
    yPos += 10;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`Activités du ${new Date(data.date).toLocaleDateString('fr-FR')}`, 20, yPos);
    
    yPos += 20;
    
    // Métriques principales
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Résumé Financier', 20, yPos);
    
    yPos += 15;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    const metriques = [
      ['Revenus:', `${data.recettes.toLocaleString()} CFA`],
      ['Dépenses:', `${data.depenses.toLocaleString()} CFA`],
      ['Bénéfice Net:', `${data.beneficeNet.toLocaleString()} CFA`],
      ['Nombre de transactions:', `${data.transactionsCount}`]
    ];
    
    metriques.forEach(([label, value]) => {
      this.pdf.text(label, 30, yPos);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(value, 100, yPos);
      this.pdf.setFont('helvetica', 'normal');
      yPos += 8;
    });
    
    // Activités par module
    if (data.activitesParModule && Object.keys(data.activitesParModule).length > 0) {
      yPos += 15;
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Activités par Module', 20, yPos);
      
      yPos += 15;
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      
      Object.entries(data.activitesParModule).forEach(([module, info]: [string, any]) => {
        this.pdf.text(`${module}:`, 30, yPos);
        this.pdf.text(`${info.montant.toLocaleString()} CFA (${info.transactions} transactions)`, 80, yPos);
        yPos += 8;
      });
    }
    
    this.addFooter();
    
    return this.pdf.output('blob');
  }

  async genererRapportPersonnalise(data: RapportData): Promise<Blob> {
    this.addHeader();
    
    let yPos = 60;
    
    // Titre du rapport
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(data.titre, 20, yPos);
    
    yPos += 10;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(data.periode, 20, yPos);
    
    yPos += 20;
    
    // Données du rapport
    Object.entries(data.donnees).forEach(([key, value]: [string, any]) => {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${this.formatKey(key)}:`, 30, yPos);
      
      this.pdf.setFont('helvetica', 'normal');
      const formattedValue = typeof value === 'number' 
        ? `${value.toLocaleString()} ${key.includes('evolution') ? '%' : 'CFA'}`
        : value.toString();
      this.pdf.text(formattedValue, 100, yPos);
      
      yPos += 10;
    });
    
    this.addFooter();
    
    return this.pdf.output('blob');
  }

  private formatKey(key: string): string {
    const mapping: Record<string, string> = {
      'revenus': 'Revenus',
      'depenses': 'Dépenses',
      'benefices': 'Bénéfices',
      'nombreTransactions': 'Nombre de transactions',
      'evolution': 'Évolution (%)'
    };
    return mapping[key] || key;
  }

  async exporterElementHTML(elementId: string, nomFichier: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Élément non trouvé');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    this.addHeader();
    
    this.pdf.addImage(imgData, 'PNG', 10, 60, imgWidth, imgHeight);
    
    this.addFooter();
    
    this.pdf.save(`${nomFichier}.pdf`);
  }
}

export const pdfGenerator = new PDFGenerator();
