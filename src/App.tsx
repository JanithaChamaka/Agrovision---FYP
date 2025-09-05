import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Router from "./Routes/Router";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <Navbar />
      <Router />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

export default App;
