import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import styles from "./styles.module.css";

function Homepage() {
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const convertToGif = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "upload.mp4", await fetchFile(video));
    await ffmpeg.run(
      "-i",
      "upload.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "converted_file.gif"
    );

    const gifFile = ffmpeg.FS("readFile", "converted_file.gif");
    const url = URL.createObjectURL(
      new Blob([gifFile.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  const setDownload = () => {
    const a = document.createElement("a");
    a.innerText = "Download";
    a.setAttribute("download", gif);
    document.body.appendChild(a);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NRD Video to GIF</h1>
      <div className={styles.gifPreview}>
        {gif && <img src={gif} alt="gif" className={styles.gifImg} download />}
      </div>
      {video && <h3 className={styles.fileLabel}> Arquivo: {video.name}</h3>}
      <input
        type="file"
        id="selectedFile"
        style={{ display: "none" }}
        onChange={(e) => setVideo(e.target.files.item(0))}
      />
      <input
        type="button"
        className={styles.convertBtn}
        onClick={() => document.getElementById("selectedFile").click()}
        value="Upload Video"
      />
      <div className={styles.buttonsDiv}>
        <button className={styles.convertBtn} onClick={convertToGif}>
          Convert to GIF
        </button>
        {gif ? (
          <button className={styles.convertBtn} onClick={setDownload}>
            Download file
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Homepage;
