import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";
import styles from "./Auth.module.css";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (phoneNumber.replace(/\D/g, "").length < 12) {
      setError("Invalid phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(ENDPOINTS.LOGIN, {
        phone: phoneNumber,
      });

      console.log("Login response:", res.data);

      localStorage.setItem("pendingPhone", phoneNumber);
      navigate("/verify");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>LOG IN</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <PhoneInput
          defaultCountry="uz"
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value)}
          className={styles.phoneInput}
          placeholder="(00) 000 -00-00"
          inputStyle={{
            border: "none",
            outline: "none",
            fontSize: "18px",
            backgroundColor: "transparent",
            flex: 1,
          }}
          countrySelectorStyleProps={{
            buttonStyle: {
              width: "fit-content",
              border: "none",
              backgroundColor: "transparent",
              padding: "0",
              margin: "0",
            },
            dropdownStyleProps: {
              style: {
                zIndex: 1000,
              },
            },
          }}
        />
        {error && <span className={styles.error}>{error}</span>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Get SMS code"}
        </button>
      </form>

      <p className={styles.switchText}>
        Don't have an account?{" "}
        <span
          className={styles.link}
          onClick={() => navigate("/register")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
