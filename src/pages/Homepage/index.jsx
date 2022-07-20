import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import LoadingIndicator from "../../components/LoadingIndicator";
import ExpandableArea from "../../components/ExpandableArea";
import styles from "./styles.module.css";

function Homepage() {
  const [fps, setFps] = useState(10);
  const [resolution, setResolution] = useState(720);
  const [video, setVideo] = useState(null);
  const [gif, setGif] = useState(null);
  const [progress, setProgress] = useState(null);
  const convertToGif = async () => {
    setGif(null);
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    await ffmpeg.setProgress((p) => setProgress(p.ratio));
    ffmpeg.FS("writeFile", "upload.mp4", await fetchFile(video));
    await ffmpeg.run(
      "-i",
      "upload.mp4",
      "-vf",
      `fps=${fps},scale=${resolution}:0:flags=lanczos`,
      "-f",
      "gif",
      "converted_file.gif"
    );
    const gifFile = ffmpeg.FS("readFile", "converted_file.gif");
    const url = URL.createObjectURL(
      new Blob([gifFile.buffer], { type: "image/gif" })
    );
    setGif(url);
    setProgress(null);
  };
  function download(dataurl, filename) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NRD Video to GIF</h1>
      {gif ? (
        <div className={styles.gifPreview}>
          <img src={gif} alt="gif" className={styles.gifImg} download />
        </div>
      ) : (
        progress !== null && <LoadingIndicator progress={progress} />
      )}
      {/* <h3 className={styles.subtitle}>GIF Settings</h3> */}
      {video && <h3 className={styles.fileLabel}> Arquivo: {video.name}</h3>}
      <input
        type="file"
        id="selectedFile"
        style={{ display: "none" }}
        onChange={(e) => {
          setVideo(e.target.files.item(0));
          setGif(null);
        }}
      />
      <ExpandableArea
        title="GIF Settings"
        content={
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
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className={styles.fileSettingsInput}
              />
            </div>
          </div>
        }
      />
      <input
        type="button"
        className={styles.convertBtn}
        onClick={() => document.getElementById("selectedFile").click()}
        value="Upload Video"
      />
      <div className={styles.buttonsDiv}>
        <button
          className={styles.convertBtn}
          onClick={convertToGif}
          disabled={false}
        >
          Convert to GIF
        </button>
        {gif ? (
          <button
            className={styles.convertBtn}
            onClick={() =>
              download(gif, "converted_file(github.com/lnardon/VideoToGIF).gif")
            }
          >
            Download converted file
          </button>
        ) : null}
      </div>
    </div>
  );
}
export default Homepage;
