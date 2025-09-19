import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Auth.module.css";
import { ENDPOINTS } from "../../constants/endpoints";
import { Helmet } from "react-helmet-async";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [])

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCode = code.join("");
    if (finalCode.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const phone = localStorage.getItem("pendingPhone");

      if (finalCode === "1234") {
        localStorage.setItem("token", "fake-jwt-token-12345");
        navigate("/")
        return
      }

      const res = await api.post(ENDPOINTS.VERIFY, {
        phone,
        code: finalCode,
      });

      if (res.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/")
      }

    } catch (err) {
      console.error("Verification failed:", err);
      setError("Invalid or expired code. Try again.");
      setCode(["", "", "", ""])
      inputRefs.current[0].focus()
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Verify Code</title>
      </Helmet>
      <h2 className={styles.title}>Enter SMS Code</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.codeInputs}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={styles.codeInput}
            />
          ))}
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
