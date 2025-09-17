import ReactStars from "react-stars"
import styles from "./Card.module.css"
import { useLocation, useNavigate } from "react-router-dom"
import CustomImage from "../CustomImage/CustomImage"

const Card = ({ product }) => {
    // const newPrice = product.discount ? product.price - ((product.price * product.discount) / 100) : product.price
    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = () => {
        navigate(`/shop/${product.gender}/${product.title}`, { state: { backgroundLocation: location } })
    }

    const sortedPrice = (price) => {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: "usd",
            minimumFractionDigits: price % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        })
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.img_wrapper}>
                <CustomImage product={product} />
            </div>
            <h3 className={styles.title}>{product.title}</h3>
            <div className={styles.rating}>
                <ReactStars value={product.rating.rate} size={24} edit={false} />
                <p>{product.rating.rate}/<span>5</span></p>
            </div>
            <div className={styles.price}>
                {
                    product.discount ? (
                        <div>
                            <p>{sortedPrice(product.price)}</p>
                            {
                                product.discount && <p className={styles.old_price}>{sortedPrice(product.oldPrice)}</p>
                            }
                            {
                                product.discount && <span className={styles.discount}>-{product.discount}%</span>
                            }
                        </div>
                    ) : <p>$120</p>
                }
            </div>
        </div >
    )
}

export default Card