import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VideoGallery.css";
import AddVideoForm from "../pages/AddVideoForm";
import { auth } from "../pages/firebaseconfig"; // import firebase auth

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);
  // Converts YouTube URLs to embed URLs
  const formatYouTubeUrl = (url) => {
    if (!url) return "";

    try {
      let videoId = "";

      // Case 1: Short URL like https://youtu.be/YYgTHAv6p3w?si=...
      if (url.includes("youtu.be")) {
        const parts = url.split("/");
        videoId = parts[parts.length - 1].split("?")[0];
      }
      // Case 2: Full URL like https://www.youtube.com/watch?v=YYgTHAv6p3w
      else if (url.includes("youtube.com/watch")) {
        const params = new URLSearchParams(url.split("?")[1]);
        videoId = params.get("v");
      } else {
        return url; // return as-is if unrecognized
      }

      // Preserve the ?si=... if exists
      const siParam = url.includes("?si=") ? url.split("?si=")[1] : "";

      return `https://www.youtube-nocookie.com/embed/${videoId}${siParam ? `?si=${siParam}` : ""}`;
    } catch (err) {
      console.error("Error formatting URL:", err);
      return url;
    }
  };


  return (
    <section id="channel" className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-right">
          Our Water Sports Activities
        </h2>
        <p className="text-center text-muted mb-4" data-aos="fade-left">
          Watch our customers having a blast as they enjoy thrilling dolphin views!
        </p>


        <div className="video-scroll" data-aos="fade-up">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-wrapper">
                {video.url ? (
                  <iframe
                    src={`${formatYouTubeUrl(video.url)}?autoplay=1&mute=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p className="text-center text-danger">
                    Invalid video URL
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VideoGallery;
