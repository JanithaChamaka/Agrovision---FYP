import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ava from "../Pages/AVA"
import Header from "../Pages/Home"
import InfoSection from "../Pages/Info"
import Navbar from "../components/Navbar"
import UserInputPage from "../Pages/UserInput"
import Chatbot from "../Pages/Chatbot";
import Auth from "../Pages/Auth";
const links = () => {
  return (
   <Router>         
          <Navbar />
      <Routes>
         <Route path="/" element={<Header />} />
         <Route path="/ava" element={<Ava />} />
         <Route path="/user-input" element={<UserInputPage />} />
         <Route path="/chatbot" element={<Chatbot/>} />
         <Route path="/info" element={<InfoSection/>} />
         <Route path="/login" element={<Auth/>} />
      </Routes>
    </Router>
  )
}
export default links