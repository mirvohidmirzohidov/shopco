import { useState } from "react";
import styles from "./ProductDetail.module.css"
import ReactStars from "react-stars";

const ProductTabs = ({ product }) => {
    const [active, setActive] = useState(1)
    const [filter, setFilter] = useState("Latest")
    const [visibleCount, setVisibleCount] = useState(6)
    const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

    const sortedComments = (product?.comments || []).sort((a, b) => {
        if (filter === "Latest") {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
        if (filter === "Oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt)
        }
        if (filter === "Highest") {
            return b.rating - a.rating
        }
        if (filter === "Lowest") {
            return a.rating - b.rating
        }
        return 0
    })

    const visibleComments = sortedComments.slice(0, visibleCount);

    return (
        <div>
            <div className={styles.tabs}>
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={`${styles.tab} ${active === i ? styles.active : ""}`}
                        onClick={() => setActive(i)}
                    >
                        {tab}
                    </button>
                ))}
                <span className={styles.indicator} style={{ transform: `translateX(${active * 100}%)` }}></span>
            </div>
            <div className={styles.tab_content}>
                {active === 0 && <div></div>}
                {active === 1 && <div className={styles.rewievs_wrapper}>
                    <div className={styles.rewievs_top}>
                        <h3>All Reviews <span>({product?.comments?.length})</span></h3>
                        <div className={styles.buttons}>
                            <div className={styles.select_wrapper}>
                                <select onChange={(e) => setFilter(e.target.value)}>
                                    <option value="Latest">Latest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Highest">Highest</option>
                                    <option value="Lowest">Lowest</option>
                                </select>
                            </div>
                            <button className={styles.add_comment_btn}>Write a Review</button>
                        </div>
                    </div>
                    <div className={styles.rewievs}>
                        {
                            visibleComments.map(item => (
                                <div key={item.id} className={styles.comment}>
                                    <ReactStars value={item.rating} size={24} edit={false} />
                                    <h4>{item.user}</h4>
                                    <p className={styles.comment_text}>{item.text}</p>
                                    <p className={styles.comment_day}>Posted on {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}</p>
                                </div>
                            ))
                        }
                    </div>
                    {
                        visibleCount < product.comments?.length && (
                            <button className={styles.more_button} onClick={() => setVisibleCount(prev => prev + 6)}>Load More Reviews</button>
                        )
                    }
                </div>}
                {active === 2 && <div></div>}
            </div>
        </div>
    )
}

export default ProductTabs