import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";
import styles from "./Auth.module.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (fullName.trim().length < 2) {
      newErrors.fullName = "the name is too short";
    }
    if (phoneNumber.replace(/\D/g, "").length < 12) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(ENDPOINTS.REGISTER, {
        name: fullName,
        phone: phoneNumber,
      });

      console.log("Register response:", res.data);

      localStorage.setItem("pendingPhone", phoneNumber);
      navigate("/verify");
    } catch (err) {
      console.error("Register error:", err);
      alert("Registration failed, try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>SIGN UP</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.input}
        />
        {errors.fullName && (
          <span className={styles.error}>{errors.fullName}</span>
        )}

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
        {errors.phoneNumber && (
          <span className={styles.error}>{errors.phoneNumber}</span>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          Continue
        </button>
      </form>

      <p className={styles.switchText}>
        Already have an account?{" "}
        <span className={styles.link} onClick={() => navigate("/login")}>
          Enter
        </span>
      </p>
    </div>
  );
}
