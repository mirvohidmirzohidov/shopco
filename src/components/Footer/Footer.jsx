import { FaTwitter } from "react-icons/fa";
import { TfiFacebook } from "react-icons/tfi";
import { FaInstagram } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import styles from "./Footer.module.css"
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../constants/endpoints";
import api from "../../services/api";

const Footer = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(ENDPOINTS.GET_HOME) 
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles.footer_container}>
      <div className={styles.footer}>
        <div className={styles.footer_newsletter}>
          <h1>STAY UPTO DATE ABOUT <br /> OUR LATEST OFFERS</h1>
          <form>
            <div className={styles.input_wrapper}>
              <TfiEmail />
              <input type="email" placeholder="Enter your email adress" />
            </div>
            <button>Subscribe to Newsletter</button>
          </form>
        </div>
        <div className={styles.footer_top}>
          <div className={styles.footer_top_left}>
            <img src="/assets/icons/logo.svg" alt="" />
            <p>We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
            <div className={styles.socials}>
              <a href={data?.socials?.twitter} target="_blank"><FaTwitter /></a>
              <a href={data?.socials?.facebook} target="_blank"><TfiFacebook /></a>
              <a href={data?.socials?.instagram} target="_blank"><FaInstagram /></a>
              <a href={data?.socials?.github} target="_blank"><IoLogoGithub /></a>
            </div>
          </div>
          <div className={styles.list}>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>
          <div className={styles.list}>
            <h4>Help</h4>
            <ul>
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className={styles.list}>
            <h4>FAQ</h4>
            <ul>
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payments</li>
            </ul>
          </div>
          <div className={styles.list}>
            <h4>Resources</h4>
            <ul>
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to - Blog</li>
              <li>Youtube Playlist</li>
            </ul>
          </div>
        </div>
        <div className={styles.footer_bottom}>
          <p>Shop.co &copy; 2000-2023, All Rights Reserved</p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <img src="/assets/icons/visa.svg" alt="visa" />
            </div>
            <div className={styles.card}>
              <img src="/assets/icons/mastercard.svg" alt="visa" />
            </div>
            <div className={styles.card}>
              <img src="/assets/icons/paypal.svg" alt="visa" />
            </div>
            <div className={styles.card}>
              <img src="/assets/icons/apple_pay.svg" alt="visa" />
            </div>
            <div className={styles.card}>
              <img src="/assets/icons/google_pay.svg" alt="visa" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer