import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";
import { ENDPOINTS } from "../../constants/endpoints";
import ReactStars from "react-stars";
import Card from "../../components/Card/Card"
import api from "../../services/api";
import styles from "./Home.module.css"

import { Helmet } from "react-helmet-async"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import "swiper/css/navigation"

const Home = () => {
  const [data, setData] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [comments, setComments] = useState([])
  const [showAllNewArrivals, setShowAllNewArrivals] = useState(false)
  const [showAllTopSelling, setShowAllTopSelling] = useState(false)

  const navigate = useNavigate()
  const visibleNewArrivals = showAllNewArrivals ? newArrivals : newArrivals.slice(0, 4)
  const visibleTopSelling = showAllTopSelling ? topSelling : topSelling.slice(0, 4)

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchData = async () => {
      try {
        const [dataRes, newArrivalsRes, topSellingRes, commentsRes] = await Promise.all([
          api.get(ENDPOINTS.GET_HOME),
          api.get(ENDPOINTS.GET_PRODUCTS, { params: { isNewArrival: true } }),
          api.get(ENDPOINTS.GET_PRODUCTS, { params: { isTopSelling: true } }),
          api.get(ENDPOINTS.GET_COMMENTS)
        ])
        setData(dataRes.data)

        const newArrivals = newArrivalsRes.data.filter(p => p.isNewArrival)
        setNewArrivals(newArrivals)

        const topSellingProducts = topSellingRes.data.filter(p => p.isTopSelling)
        setTopSelling(topSellingProducts)

        setComments(commentsRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const formatNumber = (num) => {
    if (num < 10) return "0+"

    const length = num?.toString().length
    const power = Math.pow(10, length - 1)
    const rounded = Math.floor(num / power) * power

    return rounded.toLocaleString("en-US") + "+"
  }

  return (
    <>
      <Helmet>
        <title>Home - E-Commerce</title>
        <meta name="description" content="Welcome to ShopCo - the best online shop for T-shirts, jeans and more." />
      </Helmet>
      <div className={styles.home}>
        <div className={styles.hero_container}>
          <div className={styles.hero}>
            <div className={styles.hero_content}>
              <h1 className={styles.title}>{data?.hero?.title}</h1>
              <p className={styles.subtitle}>{data?.hero?.description}</p>
              <button onClick={() => navigate("/shop")}>Shop Now</button>
              <div className={styles.statics}>
                <div>
                  <p>{formatNumber(data?.hero?.international_brands)}</p>
                  <span>International Brands</span>
                </div>
                <div>
                  <p>{formatNumber(data?.hero?.high_quality_products)}</p>
                  <span>High-Quality Products</span>
                </div>
                <div>
                  <p>{formatNumber(data?.hero?.happy_customers)}</p>
                  <span>Happy Customers</span>
                </div>
                <div>
                </div>
              </div>
            </div>
            <div className={styles.hero_imgWrapper}>
              <img src={data?.hero?.image} alt="hero img" />
            </div>
          </div>
        </div>

        <div className={styles.brands_wrapper}>
          <div className={styles.brands} id="brands">
            {
              data?.brands?.map(item => (
                <img key={item.id} src={item.logo} alt={`${item.title} logo`} />
              ))
            }
          </div>
        </div>

        <div id="newArrivals" className={`${styles.newArrivals} ${styles.products_section}`}>
          <h1 className={styles.main_title}>NEW ARRIVALS</h1>
          <div className={styles.cards}>
            {
              visibleNewArrivals.map((product, index) => (
                <Card key={index} product={product} />
              ))
            }
          </div>
          {
            newArrivals.length > 4 && <button onClick={() => setShowAllNewArrivals(prev => !prev)} className={styles.more_button}>{showAllNewArrivals ? "View Less" : "View All"}</button>
          }
        </div>

        <div className={styles.products_section}>
          <h1 className={styles.main_title}>TOP SELLING</h1>
          <div className={styles.cards}>
            {
              visibleTopSelling.map((product, index) => (
                <Card key={index} product={product} />
              ))
            }
          </div>
          {
            topSelling.length > 4 && <button onClick={() => setShowAllTopSelling(prev => !prev)} className={styles.more_button}>{showAllTopSelling ? "View Less" : "View All"}</button>
          }
        </div>

        <div className={styles.dres_style_wrapper}>
          <div className={styles.dres_style}>
            <h1 className={styles.main_title}>BROWSE BY DRESS STYLE</h1>
            <div className={styles.dres_style_images}>
              <div className={styles.dres_style_images_top}>
                <div className={`${styles.dres_style_image} ${styles.dres_style_image_short}`}>
                  <p>Casual</p>
                  <img src="/assets/images/dress_style_img.png" alt="Casual" />
                </div>
                <div className={`${styles.dres_style_image} ${styles.dres_style_image_long}`}>
                  <p>Formal</p>
                  <img src="/assets/images/dress_style_img2.png" alt="Formal" />
                </div>
              </div>
              <div className={styles.dres_style_images_bottom}>
                <div className={`${styles.dres_style_image} ${styles.dres_style_image_long}`}>
                  <p>Party</p>
                  <img src="/assets/images/dress_style_img3.png" alt="Party" />
                </div>
                <div className={`${styles.dres_style_image} ${styles.dres_style_image_short}`}>
                  <p>Gym</p>
                  <img src="/assets/images/dress_style_img4.png" alt="Gym" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.comments_wrapper}>
          <h1 className={styles.main_title}>OUR HAPPY CUSTOMERS</h1>
          <div className={styles.comments}>
            <div className={styles.buttons}>
              <button className="custom-prev"><IoArrowBackOutline /></button>
              <button className="custom-next"><IoArrowForwardOutline /></button>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {comments.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className={styles.comment}>
                    <ReactStars value={item.rating} size={24} edit={false} />
                    <h4>{item.name}</h4>
                    <p>{item.text}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home