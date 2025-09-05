import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";
import AuthBg from "../assets/images/jetwing-footer.jpg";

const AuthPage = () => {
  const { authUser, login, signup } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (authUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    const { email, password, confirmPassword, name } = formData;
    e.preventDefault();
    setMessage("");

    if (
      !email ||
      !password ||
      (!isLogin && !confirmPassword) ||
      (!isLogin && !name)
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ name, email, password });
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
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
    <div
  className="relative flex items-center justify-center min-h-screen bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${AuthBg})`,
    backgroundSize: "cover",
  }}
>
      {/* Overlay for dim effect */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden flex z-20">
        {/* Left Side */}
        <div
          className={`w-1/2 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${
            isLogin
              ? "bg-[#254336] text-white"
              : "translate-x-full bg-[#254336] text-white"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Welcome to AgroVision</h2>
          <p className="mb-6">
            Your smart agriculture assistant. {isLogin ? "Login" : "Sign up"} to
            start managing your crops efficiently.
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
              {!isLogin && (
                <input
                  type="text"
                  placeholder="User Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-[#254336] rounded-lg hover:bg-green-600 transition"
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Signing up..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
              {message && (
                <p className="text-center mt-2 text-red-600">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
