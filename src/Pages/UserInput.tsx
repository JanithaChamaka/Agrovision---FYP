import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

type PredictionData = {
  name: string;
  value: number;
}[];

const UserInputPage = () => {
  const [city, setCity] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [chartData, setChartData] = useState<PredictionData | null>(null);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  // Step 1: Get prediction and show chart
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call your model API
    const res = await fetch('/api/get-prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, fertilizer }),
    });

    const data = await res.json();
    setChartData(data.predictions); // example: [{name:"Nitrogen",value:40}, {name:"Phosphorus",value:60}]
    setStep(2);
  };

  // Step 2: Send email with chart data
  const handleSendReport = async () => {
    await fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, city, fertilizer, chartData }),
    });
    alert('Report sent!');
  };

  return (
    <div className="flex justify-center mt-40" style={{ width: '100vw', height: '80vh' }}>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-[70vw] h-[70vh] flex flex-col items-center gap-6">
        
        {/* Step 1: City + Fertilizer Form */}
        {step === 1 && (
          <form onSubmit={handlePredict} className="flex flex-col gap-4 w-full max-w-md">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="border rounded px-3 py-2"
              required
            />
            <input
              value={fertilizer}
              onChange={(e) => setFertilizer(e.target.value)}
              placeholder="Fertilizer Usage (kg)"
              type="number"
              className="border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Predict & Show Chart
            </button>
          </form>
        )}

        {/* Step 2: Show Pie Chart + Email Input */}
        {step === 2 && chartData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                className="border rounded px-3 py-2"
                required
              />
              <button
                onClick={handleSendReport}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Send Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserInputPage;
