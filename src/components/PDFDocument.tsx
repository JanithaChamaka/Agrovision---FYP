// PDFDocument.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { PredictionResult, Risk } from "../types/PredictionResult.types";

// Optional: Register font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f3f9f4", // light green background
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff", // white section
    shadowColor: "#00000033",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#254336", // dark green
  },
  header: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2d6a4f", // green
  },
  text: { marginBottom: 2, color: "#1b4332" },
  bullet: { flexDirection: "row", marginBottom: 2 },
  bulletText: { marginLeft: 5, color: "#1b4332" },
  riskContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#d8f3dc", // light green for each risk
  },
  watermark: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.05,
  },
});

interface PDFDocumentProps {
  prediction: PredictionResult;
  city: string;
  month: string;
  fertilizer: string; // optional
}

const PDFDocument: React.FC<PDFDocumentProps> = ({
  prediction,
  city,
  month,
  fertilizer,
}) => {
  // Convert actions string or array into bullet array
  const parseActions = (actions: string | string[]) => {
    if (Array.isArray(actions)) return actions.map(a => a.trim()).filter(a => a.length > 0);
    // Split comma or semicolon separated string
    return actions
      .split(/[,;]+/)
      .map(a => a.trim())
      .filter(a => a.length > 0);
  };
console.log("Rendering PDFDocument with:", { prediction, city, month, fertilizer });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Agrovision - Prediction Report</Text>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.text}>City: {city}</Text>
          <Text style={styles.text}>Month: {month}</Text>
          <Text style={styles.text}>Fertilizer Usage: {fertilizer} kg</Text>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Predicted Disease Risk: {prediction.disease_percentage}% 
          </Text>
        </View>

        {/* Top Risks */}
        <View style={styles.section}>
          <Text style={styles.header}>Top Risks:</Text>
          {prediction.top_risks.map((risk: Risk, idx: number) => (
            <View key={idx} style={styles.riskContainer}>
              <Text style={{ fontWeight: "bold", color: "#1b4332" }}>
                {idx + 1}. {risk.name} (Risk Score: {risk.risk_score})
              </Text>

              {/* Why */}
              <Text style={styles.header}>Why:</Text>
              <Text style={styles.text}>{risk.why}</Text>

              {/* Actions */}
              <Text style={styles.header}>Actions:</Text>
              {parseActions(risk.actions).map((action, i) => (
                <View key={i} style={styles.bullet}>
                  <Text>•</Text>
                  <Text style={styles.bulletText}>{action}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
