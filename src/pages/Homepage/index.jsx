import React, { useState } from "react";
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
    ffmpeg.setProgress((p) => setProgress(p.ratio));
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
      {video && (
        <div className={styles.fileNameContainer}>
          <h3 className={styles.fileLabel}> Selected File:</h3>
          <h4 className={styles.fileName}> {video.name}</h4>
        </div>
      )}
      <div className={styles.gifPreview}>
        {progress !== null ? (
          <LoadingIndicator progress={progress} />
        ) : gif ? (
          <img src={gif} alt="gif" className={styles.gifImg} download />
        ) : (
          video && (
            <video className={styles.video} controls>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>
      <input
        type="file"
        id="selectedFile"
        style={{ display: "none" }}
        onChange={(e) => {
          setVideo(e.target.files.item(0));
          setGif(null);
        }}
      />
      <button
        className={
          styles.convertBtn +
          " " +
          (video ? styles.disabledBtn : styles.activeBtn)
        }
        onClick={() => document.getElementById("selectedFile").click()}
      >
        Select Video
      </button>
      <div className={styles.buttonsDiv}>
        {video && (
          <button
            className={
              styles.convertBtn +
              " " +
              (video && !gif ? styles.activeBtn : styles.disabledBtn)
            }
            onClick={convertToGif}
            disabled={progress !== null}
          >
            Convert
          </button>
        )}
        {gif ? (
          <button
            className={
              styles.convertBtn +
              " " +
              (gif ? styles.activeBtn : styles.disabledBtn)
            }
            onClick={() =>
              download(gif, "converted_file(github.com/lnardon/VideoToGIF).gif")
            }
          >
            Download GIF
          </button>
        ) : null}
        <ExpandableArea
          title="GIF Settings"
          content={
            <div className={styles.fileSettings}>
              <p className={styles.fileSettingsMessage}>
                All the processing and conversion of the file is done on your
                local machine so your files never leave your computer.
                Increasing the FPS and RESOLUTION values also increases the time
                required for the file to be converted.
              </p>
              <div className={styles.fileSettingsContent}>
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
            </div>
          }
        />
      </div>
    </div>
  );
}
export default Homepage;
