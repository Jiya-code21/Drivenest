import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App(){
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/> 
        <Route path="*" element={<Error/>}/>

      </Routes>
<ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Footer />
    </BrowserRouter>
  );
}

export default App
