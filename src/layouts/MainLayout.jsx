import { useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { ToastContainer } from "react-toastify"

const MainLayout = ({children}) => {
      const [showBanner, setShowBanner] = useState(true)
  
  return (
    <div style={{paddingTop: showBanner ? "134px": "96px", transition:"0.4s ease padding"}}>
        <Navbar showBanner={showBanner} setShowBanner={setShowBanner} />
        <ToastContainer />
        {children}
        <Footer />
    </div>
  )
}

export default MainLayout