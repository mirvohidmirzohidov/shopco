import { useEffect, useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { ToastContainer } from "react-toastify"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  const [showBanner, setShowBanner] = useState(true)
  const token = localStorage.getItem("token")
  
  useEffect(() => {
    if (token) {
      setShowBanner(false)
    }
  }, [])

  return (
    <div
      style={{ paddingTop: showBanner ? "134px" : "96px", transition: "padding-top 0.4s ease" }}>
      <Navbar showBanner={showBanner} setShowBanner={setShowBanner} />
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout