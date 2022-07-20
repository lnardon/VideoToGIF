import React, { useRef, useState, useEffect } from "react";

import styles from "./styles.module.css";
import Arrow from "./arrow.png";

function ExpandableArea({ title, content, getStatus = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const areaRef = useRef();
  const arrowRef = useRef();
  const toggleArea = () => {
    if (!isOpen) {
      areaRef.current.classList.add(`${styles.open}`);
      areaRef.current.classList.remove(`${styles.closed}`);
      arrowRef.current.classList.add(`${styles.downArrow}`);
      arrowRef.current.classList.remove(`${styles.rightArrow}`);
    } else {
      areaRef.current.classList.add(`${styles.closed}`);
      areaRef.current.classList.remove(`${styles.open}`);
      arrowRef.current.classList.add(`${styles.rightArrow}`);
      arrowRef.current.classList.remove(`${styles.downArrow}`);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (getStatus) {
      getStatus(isOpen);
    }
  }, [isOpen]);
  return (
    <div className={styles.container}>
      <div className={styles.title} onClick={toggleArea}>
        {title}
        <img
          src={Arrow}
          alt="arrow icon"
          className={styles.icon}
          ref={arrowRef}
        />
      </div>
      <div className={styles.content} ref={areaRef}>
        {content}
      </div>
    </div>
  );
}

export default ExpandableArea;
