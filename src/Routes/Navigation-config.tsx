import Auth from "../pages/Auth";
import Ava from "../pages/AVA";
import Chatbot from "../pages/Chatbot";
import Home from "../pages/Home";
import InfoSection from "../pages/Info";
import PredictionHistoryPage from "../pages/PredictionHistory";
import UserInputPage from "../pages/UserInput";

export const NavigationConfig = [
  {
    title: "Home",
    path: "/",
    element: <Home />,
    isProtected: false,
  },
  {
    title: "User Input",
    path: "/user-input",
    element: <UserInputPage />,
    isProtected: true,
  },
  {
    title: "AVA",
    path: "/ava",
    element: <Ava/>,
    isProtected: true,
  },
  {
    title: "chatbot",
    path: "/chatbot",
    element: <Chatbot/>,
    isProtected: true,
  },
  {
    title: "Info",
    path: "/info",
    element: <InfoSection />,
    isProtected: false,
  },
  {
    title: "Login",
    path: "/login",
    element: <Auth />,
    isProtected: false,
  },
   {
    title: "History",
    path: "/history",
    element: <PredictionHistoryPage/>,
    isProtected: true,
  },
];
