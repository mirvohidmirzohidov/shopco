import { useState } from "react";
import styles from "./CustomImage.module.css";

const CustomImage = ({ product, fill }) => {
  const [isLoading, setIsLoading] = useState(true);  

  return (
    <>
      {fill ? (
        product?.img ? (
          <img
            src={product?.img[0]}
            alt={product?.title}
            className={`${styles.customImg} ${
              isLoading ? styles.loading : styles.loaded
            } ${fill ? styles.fill : ""}`}
            onLoad={() => setIsLoading(false)}
          />
        ) : null
      ) : (
        <img
          src={product?.img?.[0]}
          alt={product?.title}
          width={400}
          height={1000}
          className={`${styles.customImg} ${
            isLoading ? styles.loading : styles.loaded
          }`}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </>
  );
};

export default CustomImage;
