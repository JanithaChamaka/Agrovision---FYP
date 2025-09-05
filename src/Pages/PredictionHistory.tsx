// pages/PredictionHistoryPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { PredictionHistory } from "../types/prediction";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../components/PDFDocument";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import type { PredictionResult } from "../types/PredictionResult.types";

const PredictionHistoryPage = () => {
  const { authUser } = useAuthStore();
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);
console.log(selectedPrediction?.predictions);
  useEffect(() => {
    const fetchHistory = async () => {
      if (!authUser) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/predictions/${authUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching prediction history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [authUser]);

  const sendEmail = async (prediction: PredictionHistory) => {
    try {
      await emailjs.send(
        "service_nkcqtfh",
        "template_fcoix4s",
        {
          city: prediction.city,
          month: prediction.month,
          fertilizer: prediction.fertilizer,
          disease_percentage: prediction.predictions,
          risks: prediction.actions
            .map((r) => `${r.name} - ${r.risk_score}`)
            .join(", "),
        },
        "e-Ag0WU12ctWFr3Oe"
      );
      alert("Email sent successfully!");
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Failed to send email.");
    }
  };
console.log("History:", selectedPrediction);
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Prediction History</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600">No predictions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-green-200 text-left">
                <th className="py-3 px-6">Created Date</th>
                <th className="py-3 px-6">Description (Month)</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-green-50">
                  <td className="py-3 px-6">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6">Paddy - {item.city} ({item.month})</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => setSelectedPrediction(item)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for prediction details */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPrediction(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 font-bold"
            >
              X
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Paddy - {selectedPrediction.city} ({selectedPrediction.month})
            </h2>
            <p className="mb-2">
              <strong>Fertilizer:</strong> {selectedPrediction.fertilizer} kg
            </p>
            <p className="mb-2">
              <strong>Disease Risk:</strong>{" "}
              {<span className="text-rose-600 font-bold"> {selectedPrediction.fertilizer}%</span>}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Top Risks:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {selectedPrediction.actions.map((risk, i) => (
                  <li key={i}>
                    <strong>{risk.name}</strong> - Score: {risk.risk_score} - Why: {risk.why}
                    <br />
                    Actions: {risk.actions.join(", ")}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            if(selectedPrediction && prediction) {
  <div className="flex gap-4 mt-6">
               <PDFDownloadLink
                document={
                  <PDFDocument
                    prediction={selectedPrediction.predictions}
                    city={selectedPrediction.city}
                    month={selectedPrediction.month}
                    fertilizer={String(selectedPrediction.fertilizer)}
                  />
                }
                fileName={`prediction-${selectedPrediction.city}-${selectedPrediction.month}.pdf`}
              >
                {({ loading }) => (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {loading ? "Generating..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink> 

              <button
                onClick={() => sendEmail(selectedPrediction)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send Email
              </button>
            </div>
            }
           
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PredictionHistoryPage;
