import { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setMessage("");
    
    if (!email || !password || (!isLogin && !confirmPassword)) {
      setMessage("Please fill in all fields.");
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";
      const payload = { email, password };

      const res = await axios.post(url, payload);
      setMessage(res.data.message || (isLogin ? "Login successful!" : "Signup successful!"));

      // Optionally: save token in localStorage for login
      if (res.data.token) localStorage.setItem("token", res.data.token);

      // Clear fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Something went wrong.");
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* Left Side */}
        <div
          className={`w-1/2 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${
            isLogin ? "bg-[#254336] text-white" : "translate-x-full bg-[#254336] text-white"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Welcome to AgroVision 🌱</h2>
          <p className="mb-6">
            Your smart agriculture assistant. {isLogin ? "Login" : "Sign up"} to start managing your crops efficiently.
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* Right Side Forms */}
        <div
          className={`absolute top-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ${
            isLogin ? "right-0" : "left-0"
          }`}
        >
          <div className="w-full p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {isLogin ? "Login" : "Sign Up"}
              </h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-[#254336] rounded-lg hover:bg-green-600 transition"
              >
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
              </button>
              {message && <p className="text-center mt-2 text-red-600">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
