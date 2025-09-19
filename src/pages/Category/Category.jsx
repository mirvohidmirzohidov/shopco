import { useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import { MdArrowForwardIos } from "react-icons/md"
import { HiAdjustmentsVertical } from "react-icons/hi2"
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import api from "../../services/api"
import { ENDPOINTS } from "../../constants/endpoints"
import Pagination from "./Pagination"
import styles from "./Category.module.css"

const Category = () => {
  const [categories, setCategories] = useState([])
  const [sizes, setISzes] = useState([])
  const [styleTypes, setStyleTypes] = useState([])

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [values, setValues] = useState([50, 200])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [openFilter, setOpenFilter] = useState(false)

  const { segment } = useParams()
  const allowed = ["men", "women", "casual"];

  if (!allowed.includes(segment)) {
    return <Navigate to="/" />;
  }
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)

    setSelectedCategory(query.get("category") || null)
    setSelectedSize(query.get("size") || null)
    setSelectedStyle(query.get("style") || null)

    const min = query.get("minPrice") ? Number(query.get("minPrice")) : 0
    const max = query.get("maxPrice") ? Number(query.get("maxPrice")) : 500
    setValues([min, max])
  }, [location.search])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, sizesRes, stylesRes] = await Promise.all([
          api.get(ENDPOINTS.GET_CATEGORIES),
          api.get(ENDPOINTS.GET_SIZES),
          api.get(ENDPOINTS.GET_STYLES),
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

  const applyFilters = () => {
    const params = new URLSearchParams(location.search)

    selectedCategory ? params.set("category", selectedCategory) : params.delete("category")
    selectedSize ? params.set("size", selectedSize) : params.delete("size")
    selectedStyle ? params.set("style", selectedStyle) : params.delete("style")
    values[0] ? params.set("minPrice", values[0]) : params.delete("minPrice")
    values[1] ? params.set("maxPrice", values[1]) : params.delete("maxPrice")

    navigate({
      pathname: `/shop/${segment}`,
      search: params.toString()
    })
    setOpenFilter(false)
  }

  return (
    <div className={styles.category_container}>
      <div className={styles.breadcrumb}>
        <Link to={"/"}>Home <MdArrowForwardIos /></Link>
        <span>{segment}</span>
      </div>
      <div className={styles.wrapper}>
        <div className={`${styles.filter} ${openFilter ? styles.open : ""}`}>
          <div className={styles.filter_top}>
            <h4>Filters</h4>
            <HiAdjustmentsVertical />
            <span onClick={() => setOpenFilter(false)}>✕</span>
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
                  <button onClick={() => selectedSize === size.name ? setSelectedSize(null) : setSelectedSize(size.name)} className={selectedSize === size.name ? styles.active : ""} key={size.id}>{size.name}</button>
                ))
              }
            </div>
          </div>
          <div className={styles.filter_item}>
            <h4>Dress Style</h4>
            <div className={styles.categories}>
              {
                styleTypes?.map(item => (
                  <label key={item.id}>{item.name} <input type="checkbox" checked={selectedStyle === item.name}
                    onChange={() => selectedStyle === item.name ? setSelectedStyle(null) : setSelectedStyle(item.name)} /></label>
                ))
              }
            </div>
          </div>
          <button onClick={applyFilters} className={styles.apply_button}>Apply Filter</button>
        </div>
        <Pagination setOpenFilter={setOpenFilter} segment={segment} />
      </div>
    </div>
  )
}

export default Category