import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import styles from "./Navbar.module.css"

import { GiHamburgerMenu } from "react-icons/gi";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";

const Navbar = ({ showBanner, setShowBanner }) => {
    const [openMenu, setOpenMenu] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const dropdownLInks = [
        {
            id: 1,
            name: "Casual",
            path: "shop/casual"
        },
        {
            id: 2,
            name: "Men",
            path: "shop/men"
        },
        {
            id: 3,
            name: "Women",
            path: "shop/women"
        },
    ]

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1080) {
                setOpenMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (openMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [openMenu]);

    const handleClick = (id) => {
        if (location.pathname === "/") {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                navigate(`#${id}`, { replace: false });
            }
        } else {
            navigate(`/#${id}`);
        }
    };

    return (
        <div className={styles.wrapper}>
            {
                !token && <div className={`${styles.topBanner} ${!showBanner ? styles.hide_banner : ""}`}>
                    <p>Sign up and get 20% off to your first order. <Link to={"/register"}>Sign Up Now</Link></p>
                    <button onClick={() => setShowBanner(false)}>✕</button>
                </div>
            }
            <div className={`${styles.navbarWrapper} ${openMenu && window.innerWidth <= 1080 ? styles.navbar_open : ""}`}>
                <div style={{ borderBottom: location.pathname !== "/" ? "1px solid var(--black-10)" : "" }} className={styles.navbar}>
                    <div className={styles.logoWrapper}>
                        <button onClick={() => setOpenMenu(prev => !prev)} className={styles.navbarToggle}>
                            {openMenu ? '✕' : <GiHamburgerMenu />}
                        </button>
                        <Link to={"/"}><img className={styles.logo} src="/assets/icons/logo.svg" alt="Logo" /></Link>
                    </div>
                    <div className={styles.links}>
                        <div className={styles.dropdownWrapper}>
                            <div className={styles.dropdown}>
                                {
                                    dropdownLInks.map(item => (
                                        <Link to={item.path} key={item.id}>{item.name}</Link>
                                    ))
                                }
                            </div>
                            <p>Shop <MdOutlineKeyboardArrowDown /></p>
                        </div>
                        <Link to={"/"}>On Sale</Link>
                        <Link to={"/"} onClick={() => handleClick("newArrivals")}>New Arrivals</Link>
                        <Link to={"/"} onClick={() => handleClick("brands")}>Brands</Link>
                    </div>
                    <div className={styles.inputWrapper}>
                        <IoSearch />
                        <input type="text" placeholder="Search for products..." />
                    </div>
                    <div className={styles.icons}>
                        <div><IoSearch /></div>
                        <Link to={"/cart"}><PiShoppingCartSimpleBold /></Link>
                        {
                            localStorage.getItem("token") ? <Link to={"/profile"}><CgProfile /></Link> : <Link to={"/login"}><IoMdLogIn /></Link>
                        }
                    </div>
                </div>
                <div style={{ display: openMenu ? "flex" : "none" }} className={`${styles.links} ${styles.menu_links}`} onClick={(e) => {
                    if (e.target.tagName === "A") {
                        setOpenMenu(false)
                        setOpenDropdown(false)
                    }
                }}>
                    <div className={styles.phone_dropdownWrapper}>
                        <p onClick={() => setOpenDropdown(prev => !prev)}>Shop <MdOutlineKeyboardArrowDown className={openDropdown ? styles.rotated : ""} /></p>
                        <div className={`${styles.phone_dropdown} ${openDropdown ? styles.phone_dropdown_open : ""}`}>
                            {
                                dropdownLInks.map(item => (
                                    <Link to={item.path} key={item.id}>{item.name}</Link>
                                ))
                            }
                        </div>
                    </div>
                    <Link to={"/"}>On Sale</Link>
                    <Link to={"/"}>New Arrivals</Link>
                    <Link to={"/"}>Brands</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar