import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { MdArrowForwardIos } from "react-icons/md";
import ReactStars from "react-stars";
import { toast } from "react-toastify";
import Card from "../../components/Card/Card";
import ProductTabs from "./ProductTabs";
import styles from "./ProductDetail.module.css"
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";

const ProductDetail = () => {
  const [product, setProduct] = useState({})
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

  const { name } = useParams()
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)
  const newPrice = product.discount ? product.price - ((product.price * product.discount) / 100) : product.price

  useEffect(() => {
    window.scrollTo(0, 0)

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

  }, [name])

  useEffect(() => {
    if (!product) return

    const fetchRelatedProducts = async () => {
      try {
        const res = await api.get(ENDPOINTS.GET_PRODUCTS, {
          params: {
            category: product.category,
            excludeId: product.id,
            limit: 4
          }
        })
        const products = res.data.filter(item => item.category === product?.category && item.id !== product.id).slice(0, 4)
        setRelatedProducts(products)
      } catch (error) {
        console.log(error);
      }
    }
    fetchRelatedProducts()

    if (product?.filter?.colors) {
      setSelectedColor(product.filter.colors[0])
    }
    if (product?.filter?.sizes) {
      setSelectedSize(product.filter.sizes[0])
    }
  }, [product])

  const handleAddToCart = () => {
    const products = JSON.parse(localStorage.getItem("carts")) || []
    const isExistProduct = products.find(a => a?.id === product?.id)

    if (isExistProduct) {
      const updatedData = products.map(item => {
        if (item.id === product.id) {
          return {
            ...item,
            color: selectedColor,
            size: selectedSize,
            quantity
          }
        }
        return item
      })
      localStorage.setItem("carts", JSON.stringify(updatedData))
    } else {
      const data = [...products, {
        ...product,
        color: selectedColor,
        size: selectedSize,
        quantity
      }]
      localStorage.setItem("carts", JSON.stringify(data))
    }
    toast("Product added to your bag!")
  }

  return (
    <div className={styles.product_detail_wrapper}>
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        {
          paths?.map((path, index) => {
            const fullPath = "/" + paths?.slice(0, index + 1).join("/")
            const isLast = index === paths?.length - 1
            return (
              <div key={index} className={styles.breadcrumb_item}>
                <MdArrowForwardIos />
                {isLast ? (
                  <span>{decodeURIComponent(path)}</span>
                ) : (
                  path === "shop" ? <Link to={"/shop.casual"}>{decodeURIComponent(path)}</Link> : <Link to={fullPath}>{decodeURIComponent(path)}</Link>
                )}
              </div>
            )
          })
        }
      </div>
      <div className={styles.product_info}>
        <div className={styles.images}>
          <div className={styles.images_left}>
            {
              product?.img?.map((item, index) => (
                <div key={index} className={`${styles.img_wrapper} ${selectedImg === index ? styles.active_img : ""}`}>
                  <img onClick={() => setSelectedImg(index)} src={item} alt="product image" />
                </div>
              ))
            }
          </div>
          <div className={styles.images_right}>
            <img src={product?.img?.[selectedImg]} alt="product image" />
          </div>
        </div>

        <div className={styles.product_info_right}>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.rating}>
            <ReactStars value={product?.rating?.rate} size={24} edit={false} />
            <p>{product?.rating?.rate}/<span>5</span></p>
          </div>
          <div className={styles.price}>
            {
              product.discount ? (
                <div className={styles.price}>
                  <p>${newPrice}</p>
                  <p className={styles.old_price}>${product.price}</p>
                  <span className={styles.discount}>-{product.discount}%</span>
                </div>
              ) : <p>${product.price}</p>
            }
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.colors_wrapper}>
            <p>Select Colors</p>
            <div className={styles.colors}>
              {
                product?.filter?.colors.map((color, index) => (
                  <label key={index} className={styles.color_circle}>
                    <input onChange={() => setSelectedColor(color)} checked={selectedColor === color} type="radio" name="color" value={color} />
                    <span style={{ backgroundColor: color }}></span>
                  </label>
                ))
              }
            </div>
          </div>
          <div className={styles.sizes_wrapper}>
            <p>Select Colors</p>
            <div className={styles.sizes}>
              {
                product?.filter?.sizes.map((size, index) => (
                  <button onClick={() => setSelectedSize(size)} className={selectedSize === size ? styles.active_size : ""} key={index}>
                    {size}
                  </button>
                ))
              }
            </div>
          </div>
          <div className={styles.quantity_wrapper}>
            <div className={styles.quantity}>
              <button onClick={() => {
                if (quantity !== 1) {
                  setQuantity(prev => prev - 1)
                }
              }}>-</button>
              <p>{quantity}</p>
              <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart} className={styles.add_button}>Add to Cart</button>
          </div>
        </div>
      </div>
      <ProductTabs product={product} />
      <div className={styles.related_products}>
        <h1>You might also like</h1>
        <div className={styles.cards}>
          {
            relatedProducts.map(product => (
              <Card key={product.id} product={product} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ProductDetail