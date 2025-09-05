import jsPDF from "jspdf";
import type { PredictionResult } from "../types/PredictionResult.types";

export const downloadPDF = (
  prediction: PredictionResult,
  city: string,
  month: string,
  fertilizer: string
) => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  // Helper function to add wrapped text and update y
  const addWrappedText = (text: string, x: number, startY: number, fontSize: number, lineHeight: number = 5) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth - (x - margin));
    lines.forEach((line: string) => {
      doc.text(line, x, startY);
      startY += lineHeight;
    });
    return startY;
  };

  // Helper function to clean text
  const cleanText = (text: string | string[]): string => {
    if (Array.isArray(text)) {
      return text
        .join(' ')
        .replace(/�/g, '')  // Remove replacement characters
        .replace(/"e/g, '≥');  // Fix >= symbols
    }
    return text
      .replace(/�/g, '')  // Remove replacement characters
      .replace(/"e/g, '≥');  // Fix >= symbols
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Agrovision - Prediction Report", pageWidth / 2, y, { align: "center" });
  y += 15;

  // Basic Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  y = addWrappedText(`City: ${city}`, margin, y, 12, 6);
  y += 4;
  y = addWrappedText(`Month: ${month}`, margin, y, 12, 6);
  y += 4;
  y = addWrappedText(`Fertilizer Usage: ${fertilizer} kg`, margin, y, 12, 6);
  y += 4;
  y = addWrappedText(`Predicted Disease Risk: ${prediction.disease_percentage}%`, margin, y, 12, 6);
  y += 12;

  // Top Risks Header
  doc.setFont("helvetica", "bold");
  y = addWrappedText("Top Risks:", margin, y, 12, 6);
  y += 6;

  prediction.top_risks.forEach((risk, index) => {
    if (y > 260) {  // Adjusted for A4 height to avoid overflow
      doc.addPage();
      y = 20;
    }

    // Clean the texts
    const cleanedWhy = cleanText(risk.why);
    const cleanedActions = cleanText(risk.actions);
console.log("Cleaned Actions:", cleanedActions);
    // Risk Name
    doc.setFont("helvetica", "bold");
    y = addWrappedText(`${index + 1}. ${risk.name} (Risk Score: ${risk.risk_score})`, margin + 5, y, 12, 6);
    y += 4;

    // Why Section
    doc.setFont("helvetica", "bold");
    doc.text("Why:", margin + 5, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(cleanedWhy, margin + 10, y, 12, 5);
    y += 4;

    // Actions Section
    doc.setFont("helvetica", "bold");
    doc.text("Actions:", margin + 5, y);
    y += 6;
    doc.setFont("helvetica", "normal");

    // Parse actions string into items
    let actionsText = cleanedActions.replace(/^- ?/, ''); // Remove leading - if present
    const actionItems: string[] = actionsText.split(/[.;]+/).filter(item => item.trim().length > 2);

    // Add each action as a bullet
    actionItems.forEach((action: string) => {
      y = addWrappedText(`- ${action.trim()}`, margin + 10, y, 12, 5);
      y += 2;
    });
    y += 8;
  });

  doc.save(`prediction-${city}-${month}.pdf`);
};