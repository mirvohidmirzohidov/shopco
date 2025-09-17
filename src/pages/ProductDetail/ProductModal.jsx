import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import CustomImage from "../../components/CustomImage/CustomImage"
import ReactStars from "react-stars"
import styles from "./ProductDetail.module.css"
import api from "../../services/api"
import { ENDPOINTS } from "../../constants/endpoints"
import { toast } from "react-toastify"


const ProductModal = () => {
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const { gender, name } = useParams()
  const newPrice = product.discount ? product.price - ((product.price * product.discount) / 100) : product.price

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(ENDPOINTS.GET_PRODUCTS, {
          params: { name }
        })
        const product = res.data.find(item => item.title === name)
        setProduct(product)
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct()
  })

  const handleAddToCart = () => {
    const products = JSON.parse(localStorage.getItem("carts")) || []
    const isExistProduct = products.find(a => a?.id === product?.id)

    if (isExistProduct) {
      const updatedData = products.map(item => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }
        return item
      })
      localStorage.setItem("carts", JSON.stringify(updatedData))
    } else {
      const data = [...products, {
        ...product,
        quantity: 1
      }]
      localStorage.setItem("carts", JSON.stringify(data))
    }
    toast("Product added to your bag!")
  }

  return (
    <div onClick={() => navigate(-1)} className={styles.productModal}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <div className={styles.imgWrapper}>
          <CustomImage product={product} />
        </div>
        <div className={styles.info}>
          <h3>{product?.title}</h3>
          <p className={styles.price}>${newPrice}</p>
          <div className={styles.rating}>
            <p>{product?.rating?.rate}</p>
            <ReactStars value={product?.rating?.rate} size={24} edit={false} />
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.buttons}>
            <button onClick={handleAddToCart}>Add to bag</button>
            <button onClick={() => navigate(`/shop/${gender}/${name}`)}>View full detail</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal