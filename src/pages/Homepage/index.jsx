import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import styles from "./styles.module.css";

function Homepage() {
  const [fps, setFps] = useState(10);
  const [resolution, setResolution] = useState(720);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const convertToGif = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "upload.mp4", await fetchFile(video));
    await ffmpeg.run(
      "-i",
      "upload.mp4",
      "-vf",
      `fps=${fps},scale=${resolution}:-1:flags=lanczos`,
      "-f",
      "gif",
      "converted_file.gif"
    );

    const gifFile = ffmpeg.FS("readFile", "converted_file.gif");
    const url = URL.createObjectURL(
      new Blob([gifFile.buffer], { type: "image/gif" })
    );
    setGif(url);
    console.log(video);
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
      {gif && (
        <div className={styles.gifPreview}>
          <img src={gif} alt="gif" className={styles.gifImg} download />
        </div>
      )}
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
      <h3 className={styles.subtitle}>GIF Settings</h3>
      <div className={styles.fileSettings}>
        <div className={styles.fileSettingsDiv}>
          <h4 className={styles.fileSettingsLabel}>FPS: {fps}</h4>
          <input
            type="range"
            name="fps"
            id=""
            min={5}
            max={60}
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            className={styles.fileSettingsInput}
          />
        </div>
        <div className={styles.fileSettingsDiv}>
          <h4 className={styles.fileSettingsLabel}>
            Resolution: {resolution}p
          </h4>
          <input
            type="range"
            name="resolution"
            id=""
            min={144}
            max={2160}
            step={40}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className={styles.fileSettingsInput}
          />
        </div>
      </div>
      <div className={styles.buttonsDiv}>
        <button
          className={styles.convertBtn}
          onClick={convertToGif}
          disabled={false}
        >
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
