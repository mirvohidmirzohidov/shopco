import { Route, Routes, useLocation } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home/Home"
import ProductDetail from "../pages/ProductDetail/ProductDetail"
import ProductModal from "../pages/ProductDetail/ProductModal"
import Category from "../pages/Category/Category"
import Cart from "../pages/Cart/Cart"

const AppRouter = () => {
  const location = useLocation()
  const state = location.state?.backgroundLocation

  return (
    <>
      <MainLayout>
        <Routes location={state || location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:gender/:name" element={<ProductDetail />} />
          <Route path="/shop/:segment" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>

        {state && (
          <Routes>
            <Route path="/shop/:gender/:name" element={<ProductModal />} />
          </Routes>
        )}
      </MainLayout>
    </>
  )
}

export default AppRouter
