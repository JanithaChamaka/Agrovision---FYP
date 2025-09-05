import Auth from "../Pages/Auth";
import Ava from "../Pages/AVA";
import Chatbot from "../Pages/Chatbot";
import Home from "../Pages/Home";
import InfoSection from "../Pages/Info";
import PredictionHistoryPage from "../Pages/PredictionHistory";
import UserInputPage from "../Pages/UserInput";

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
