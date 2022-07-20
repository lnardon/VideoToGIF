import React, { useEffect, useRef } from "react";

import styles from "./styles.module.css";

function LoadingIndicator({ progress }) {
  const ref = useRef();

  useEffect(() => {
    ref.current.style.width = `${progress * 100}%`;
  }, [progress]);

  return (
    <div className={styles.progressContainer}>
      <h1>{(progress * 100).toFixed(0)}%</h1>
      <div className={styles.progressValue} ref={ref}></div>
    </div>
  );
}

export default LoadingIndicator;
