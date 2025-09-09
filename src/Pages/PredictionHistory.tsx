import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { PredictionHistory } from "../types/PredictionHistory.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../components/PDFDocument";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const PredictionHistoryPage = () => {
  const { authUser } = useAuthStore();
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
        console.log("API Response:", res.data);
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
          disease_percentage: prediction.diseasePercentage,
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

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-[calc(100vh-60px)] mt-16 px-6 bg-gray-100 flex flex-col">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Prediction History</h1>

      {/* Table Section */}
      <div className="flex-1 overflow-y-auto rounded-xl shadow-lg bg-white">
        {loading ? (
          <p className="text-center p-4">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600 p-4">No predictions found.</p>
        ) : (
          <>
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-200 text-left">
                  <th className="py-3 px-20">Created Date</th>
                  <th className="py-3 px-10">Description (Month)</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-green-50">
                    <td className="py-3 px-20">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      Paddy - {item.city} ({item.month})
                    </td>
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

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 py-4 border-t">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-[80%] max-w-5xl p-6 rounded-xl shadow-xl relative"
          >
            <button
              onClick={() => setSelectedPrediction(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Paddy - {selectedPrediction.city} ({selectedPrediction.month})
            </h2>
            <p className="mb-2">
              <strong>Fertilizer:</strong> {selectedPrediction.fertilizer} kg
            </p>
            <p className="mb-2">
              <strong>Disease Risk:</strong>{" "}
              <span className="text-rose-600 font-bold">
                {selectedPrediction.diseasePercentage}%
              </span>
            </p>

            <div className="mt-4 h-[60%] max-h-5xl overflow-y-auto pr-2">
              <h3 className="font-semibold mb-2">Top Risks:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {selectedPrediction.actions.map((risk, i) => (
                  <li key={i} className="mb-2">
                    <strong>{risk.name}</strong> - Score: {risk.risk_score} - Why: {risk.why}
                    <br />
                    Actions: {risk.actions.join(", ")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 mt-6">
              <PDFDownloadLink
                document={
                  <PDFDocument
                    disease_percentage={selectedPrediction.diseasePercentage}
                    city={selectedPrediction.city}
                    month={selectedPrediction.month}
                    fertilizer={String(selectedPrediction.fertilizer)}
                     top_risks={selectedPrediction.actions} 
                  />
                }
                fileName={`prediction-${selectedPrediction.city}-${selectedPrediction.month}.pdf`}
              >
                {({ loading }) => (
                  <button className="px-4 py-2 bg-[#254336] rounded-lg hover:bg-green-600 text-white">
                    {loading ? "Generating..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>

              <button
                onClick={() => sendEmail(selectedPrediction)}
                className="px-4 py-2 bg-[#254336] rounded-lg hover:bg-green-600 text-white"
              >
                Send Email
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PredictionHistoryPage;
