import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import styles from "./styles.module.css";

const ffmpeg = createFFmpeg({ log: true });

function Homepage() {
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  useEffect(() => {
    (async () => {
      await ffmpeg.load();
    })();
  }, []);

  const convertToGif = async () => {
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
      "NRD Software result.gif"
    );

    const gifFile = ffmpeg.FS("readFile", "NRD Software result.gif");
    const url = URL.createObjectURL(
      new Blob([gifFile.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  const setDownload = () => {
    const a = document.createElement("a");
    a.setAttribute("download", gif);
  };
  return (
    <div>
      <h1>Homepage</h1>
      <input
        type="file"
        name="video"
        onChange={(e) => setVideo(e.target.files.item(0))}
      />
      <button onClick={convertToGif}>asdas</button>
      {video && <video controls src={URL.createObjectURL(video)}></video>}
      {gif && <img src={gif} alt="s" download />}
    </div>
  );
}

export default Homepage;
