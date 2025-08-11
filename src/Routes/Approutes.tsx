import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ava from "../Pages/AVA"
import Header from "../Pages/Home"
import InfoSection from "../Pages/Info"
import Navbar from "../Pages/components/Navbar"
import UserInputPage from "../Pages/UserInput"
import Chatbot from "../Pages/chatbot";

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
      </Routes>
    </Router>
  )
}
export default links