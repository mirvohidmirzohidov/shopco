import { Outlet } from "react-router-dom"
import styles from "./AuthLayout.module.css"

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.wrapper}>
        {children}
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
