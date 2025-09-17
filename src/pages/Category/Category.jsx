import { Link, useParams } from "react-router-dom"
import { MdArrowForwardIos } from "react-icons/md"
import { HiAdjustmentsVertical } from "react-icons/hi2"
import { useEffect, useState } from "react"
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import api from "../../services/api"
import { ENDPOINTS } from "../../constants/endpoints"
import styles from "./Category.module.css"

const Category = () => {
  const { segment } = useParams()
  const [categories, setCategories] = useState([])
  const [sizes, setISzes] = useState([])
  const [styleTypes, setStyleTypes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [values, setValues] = useState([50, 200])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, sizesRes, stylesRes] = await Promise.all([
          api.get(ENDPOINTS.GET_CATEGORIES),
          api.get(ENDPOINTS.GET_SIZES),
          api.get(ENDPOINTS.GET_STYLES)
        ])
        setCategories(categoriesRes.data)
        setISzes(sizesRes.data)
        setStyleTypes(stylesRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [segment])

  return (
    <div className={styles.category_container}>
      <div className={styles.breadcrumb}>
        <Link to={"/"}>Home <MdArrowForwardIos /></Link>
        <span>{segment}</span>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.filter}>
          <div className={styles.filter_top}>
            <h4>Filters</h4>
            <HiAdjustmentsVertical />
          </div>
          <div className={`${styles.filter_item} ${styles.categories}`}>
            {
              categories?.map(item => (
                <label key={item.id}>{item.name} <input type="checkbox" checked={selectedCategory === item.name}
                  onChange={() => selectedCategory === item.name ? setSelectedCategory(null) : setSelectedCategory(item.name)} /></label>
              ))
            }
          </div>
          <div className={styles.filter_item}>
            <h4 className={styles.title}>Price</h4>
            <RangeSlider
              min={0}
              max={500}
              step={1}
              value={values}
              onInput={setValues}
            />
            <div className={styles.prices}>
              <span>${values[0]}</span>
              <span>${values[1]}</span>
            </div>
          </div>
          <div className={styles.filter_item}>
            <h4>Size</h4>
            <div className={styles.sizes}>
              {
                sizes?.map(size => (
                  <button onClick={() => setSelectedSize(size.name)} className={selectedSize === size.name ? styles.active : ""} key={size.id}>{size.name}</button>
                ))
              }
            </div>
          </div>
          <div className={`${styles.filter_item} ${styles.categories}`}>
            {
              styleTypes?.map(item => (
                <label key={item.id}>{item.name} <input type="checkbox" checked={selectedStyle === item.name}
                  onChange={() => selectedStyle === item.name ? setSelectedStyle(null) : setSelectedStyle(item.name)} /></label>
              ))
            }
          </div>
          <button className={styles.apply_button}>Apply Filter</button>
        </div>
        <div className={styles.cards}>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
          <h1>h</h1>
        </div>
      </div>
    </div>
  )
}

export default Category