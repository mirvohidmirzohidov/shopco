import { useEffect, useState } from "react"
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card"
import styles from "./Category.module.css"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiAdjustmentsVertical } from "react-icons/hi2";

const Pagination = ({ segment, setOpenFilter }) => {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [perpage, setPerpage] = useState(9)
    const [sort, setSort] = useState("")
    const [open, setOpen] = useState(false)
    const [totalPages, setTotalPages] = useState(10)

    const location = useLocation()
    const navigate = useNavigate()

    const sortOptions = [
        { value: "popular", label: "Most Popular" },
        { value: "newest", label: "Newest Arrivals" },
        { value: "priceLowHigh", label: "Price: Low to High" },
        { value: "priceHighLow", label: "Price: High to Low" },
        { value: "rating", label: "Best Rated" },
        { value: "discount", label: "Biggest Savings" },
    ]

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = new URLSearchParams(location.search)

                const res = await api.get(ENDPOINTS.GET_PRODUCTS, {
                    params:
                        segment === "men" || segment === "women"
                            ? { gender: segment, ...Object.fromEntries(query) }
                            : Object.fromEntries(query)
                })

                let data = res.data

                if (segment === "men" || segment === "women") {
                    data = data.filter(p => p.gender === segment)
                }

                if (query.get("category")) {
                    data = data.filter(p => p.category === query.get("category"))
                }
                if (query.get("size")) {
                    data = data.filter(p => p.sizes.includes(query.get("size")))
                }
                if (query.get("style")) {
                    data = data.filter(p => p.style === query.get("style"))
                }
                if (query.get("minPrice") || query.get("maxPrice")) {
                    const min = Number(query.get("minPrice")) || 0
                    const max = Number(query.get("maxPrice")) || Infinity
                    data = data.filter(p => p.price >= min && p.price <= max)
                }

                setProducts(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchProducts()
    }, [segment, location.search])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        params.set("page", page)
        params.set("perpage", perpage)
        if (sort) params.set("sort", sort)

        const newSearch = params.toString()

        navigate({
            pathname: location.pathname,
            search: newSearch
        })
    }, [page, segment, sort])

    const handleSelect = (value) => {
        setSort(value)
        setOpen(false)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    return (
        <div className={styles.cards}>
            {
                products.length ? (
                    <>
                        <div className={styles.top}>
                            <h1>{segment}</h1>
                            <div className={styles.dropdown}>
                                <button
                                    className={styles.trigger}
                                    onClick={() => setOpen(!open)}
                                >
                                    Sort by:{" "}
                                    <span className={styles.selected}>
                                        {sortOptions.find(o => o.value === sort)?.label}
                                    </span>
                                    <span className={styles.arrow}>
                                        <MdOutlineKeyboardArrowDown style={{ transform: open ? "rotate(180deg)" : "" }} />
                                    </span>
                                </button>
                                {open && (
                                    <ul className={styles.menu}>
                                        {sortOptions.map(option => (
                                            <li
                                                key={option.value}
                                                className={`${styles.item} ${sort === option.value ? styles.active : ""}`}
                                                onClick={() => handleSelect(option.value)}
                                            >
                                                {option.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <span onClick={() => setOpenFilter(true)} className={styles.filterIcon}><HiAdjustmentsVertical /></span>
                        </div>

                        <div className={styles.cards}>
                            {products.map(product => (
                                <Card key={product.id} product={product} />
                            ))}
                        </div>

                        <div className={styles.pagination}>
                            <button
                                className={`${styles.pageBtn} ${page === 1 ? styles.disabled : ""}`}
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <FaArrowLeft /> Previous
                            </button>

                            <div className={styles.nums}>
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1
                                    if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1 || pageNum === 2) {
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`${styles.pageNum} ${page === pageNum ? styles.active : ""}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                                        return <span key={pageNum} className={styles.dots}>...</span>
                                    }
                                    return null
                                })}
                            </div>

                            <button
                                className={`${styles.pageBtn} ${page === totalPages ? styles.disabled : ""}`}
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next <FaArrowRight />
                            </button>
                        </div></>
                ) : (
                    <h1>No data</h1>
                )
            }
        </div>
    )
}

export default Pagination