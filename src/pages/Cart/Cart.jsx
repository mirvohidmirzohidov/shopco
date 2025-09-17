import { MdArrowForwardIos, MdOutlineDiscount } from "react-icons/md"
import { Link } from "react-router-dom"
import { HiTrash } from "react-icons/hi2";
import { useEffect, useState } from "react"
import api from "../../services/api";
import styles from "./Cart.module.css"
import { ENDPOINTS } from "../../constants/endpoints";
import { FaArrowRight } from "react-icons/fa";

const Cart = () => {
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)

        const saved = JSON.parse(localStorage.getItem("carts")) || []
        setProducts(saved)
    }, [])

    const deleteFromCart = (id) => {
        const updatedProducts = products.filter(item => item.id !== id)
        localStorage.setItem("carts", JSON.stringify(updatedProducts))
        setProducts(updatedProducts)
    }

    const handleIncrement = (id) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    quantity: product.quantity + 1
                }
            }
            return product
        })
        localStorage.setItem("carts", JSON.stringify(updatedProducts))
        setProducts(updatedProducts)
    }

    const handleDecrement = (id) => {
        const existProduct = products.find(product => product.id === id)

        if (existProduct.quantity === 1) {
            deleteFromCart(id)
        } else {
            const updatedProducts = products.map(product => {
                if (product.id === id) {
                    return {
                        ...product,
                        quantity: product.quantity - 1
                    }
                }
                return product
            })
            localStorage.setItem("carts", JSON.stringify(updatedProducts))
            setProducts(updatedProducts)
        }
    }

    useEffect(() => {
        const total = products.reduce((acc, item) => {
            return acc + (item.price * item.quantity)
        }, 0)
        setTotal(total)
    }, [products])

    const sortedPrice = (price) => {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: "usd",
            minimumFractionDigits: price % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        })
    }

    const discountCalculation = (e) => {
        e.preventDefault()
        console.log(e.target.promo.value);

    }

    return (
        <div className={styles.cart_container}>
            <div className={styles.breadcrumb}>
                <Link to={"/"}>Home <MdArrowForwardIos /></Link>
                <span>Cart</span>
            </div>
            <h1 className={styles.title}>YOUR CART</h1>
            <div className={styles.cart_content}>
                <div className={styles.cards}>
                    {
                        products.map(product => (
                            <div key={product.id} className={styles.card}>
                                <div className={styles.card_left}>
                                    <div className={styles.img_wrapper}>
                                        <img src={product.img?.[0]} alt={product.title} />
                                    </div>
                                    <div>
                                        <h4>{product.title}</h4>
                                        <p className={styles.size}>size: <span>Large</span></p>
                                        <p className={styles.price}>${product.price * product.quantity}</p>
                                    </div>
                                </div>
                                <div className={styles.card_right}>
                                    <HiTrash onClick={() => deleteFromCart(product.id)} />
                                    <div className={styles.buttons}>
                                        <button onClick={() => handleDecrement(product.id)}>-</button>
                                        <span>{product.quantity}</span>
                                        <button onClick={() => handleIncrement(product.id)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.order_summary}>
                    <h3>Order Summary</h3>
                    <div className={styles.calculations}>
                        <div className={styles.calculation_item}>
                            <p>Subtotal</p>
                            <span>{sortedPrice(total)}</span>
                        </div>
                        <div className={styles.calculation_item}>
                            <p>Discount ({discount}%)</p>
                            <span className={styles.discount}>-{sortedPrice((total * discount) / 100)}</span>
                        </div>
                        <div className={styles.calculation_item}>
                            <p>Delivery Fee</p>
                            <span>$15</span>
                        </div>
                        <div className={`${styles.calculation_item} ${styles.total}`}>
                            <p>Total</p>
                            <span>{sortedPrice(total - ((total * discount) / 100) + 15)}</span>
                        </div>
                    </div>
                    <form onSubmit={discountCalculation}>
                        <div className={styles.input_wrapper}>
                            <MdOutlineDiscount />
                            <input type="text" placeholder="Add promo code" name="promo" />
                        </div>
                        <button type="submit">Apply</button>
                    </form>
                    <button className={styles.checkout_button}>Go to Checkout <FaArrowRight /></button>
                </div>
            </div>
        </div>
    )
}

export default Cart