import { Route, Routes, useLocation } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import AuthLayout from "../layouts/AuthLayout"

import Home from "../pages/Home/Home"
import ProductDetail from "../pages/ProductDetail/ProductDetail"
import ProductModal from "../pages/ProductDetail/ProductModal"
import Category from "../pages/Category/Category"
import Cart from "../pages/Cart/Cart"
import Register from "../pages/Auth/Register"
import Login from "../pages/Auth/Login"
import VerifyCode from "../pages/Auth/VerifyCode"

const AppRouter = () => {
  const location = useLocation()
  const state = location.state?.backgroundLocation

  return (
    <>
      <Routes location={state || location}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:gender/:name" element={<ProductDetail />} />
          <Route path="/shop/:segment" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyCode />} />
        </Route>

        <Route path="*" element={<h1>404</h1>} />
      </Routes>

      {state && (
        <Routes>
          <Route path="/shop/:gender/:name" element={<ProductModal />} />
        </Routes>
      )}
    </>
  )
}

export default AppRouter
