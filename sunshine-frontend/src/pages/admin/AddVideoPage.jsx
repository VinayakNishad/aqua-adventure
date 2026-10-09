import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addVideo, getVideos } from "../../services/videoService";
import { getErrorMessage } from "../../services/apiClient";
import "./AddVideoPage.css";

const YOUTUBE_ID_RE =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;

const getYouTubeId = (url) => url?.trim().match(YOUTUBE_ID_RE)?.[1] ?? null;

const validateLink = (link) => {
  if (!link.trim()) return "Paste a YouTube link.";
  if (!getYouTubeId(link)) return "Must be a youtube.com or youtu.be video URL.";
  return "";
};

/** Admin page: add YouTube videos and list existing ones. */
export default function AddVideoPage() {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos()
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(getErrorMessage(err, "Failed to load videos.")))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = validateLink(link);
    setError(message);
    if (message) return;

    setSubmitting(true);
    try {
      const data = await addVideo(link.trim());
      toast.success(data?.message || "Video added");
      if (data?.video) setVideos((prev) => [data.video, ...prev]);
      setLink("");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to add video.");
      if (err?.response?.status === 409) setError(msg);
      else toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Videos</h1>
          <p>YouTube videos featured on the website.</p>
        </div>
      </header>

      <section className="admin-card">
        <h2 className="admin-card__title">Add a video</h2>
        <form className="video-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field video-form__field">
            <label htmlFor="video-link">YouTube link</label>
            <input
              id="video-link"
              type="url"
              inputMode="url"
              className={`form-control${error ? " is-invalid" : ""}`}
              placeholder="https://www.youtube.com/watch?v=…"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "video-link-error" : "video-link-hint"}
            />
            {error ? (
              <div id="video-link-error" className="invalid-feedback d-block">
                {error}
              </div>
            ) : (
              <div id="video-link-hint" className="admin-field__hint">
                Supports youtube.com/watch, youtu.be and Shorts links.
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-cta video-form__submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add video"}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">
          Existing videos {!loading && <span className="text-muted">({videos.length})</span>}
        </h2>
        {loading ? (
          <div className="text-center py-4" role="status">
            <span className="spinner-border" aria-hidden="true" />
            <span className="visually-hidden">Loading videos…</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="admin-empty">
            <i className="bi bi-play-btn" aria-hidden="true" />
            <p>No videos yet.</p>
          </div>
        ) : (
          <ul className="video-list">
            {videos.map((video) => {
              const id = getYouTubeId(video.url);
              return (
                <li key={video._id || video.url} className="video-list__item">
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <span className="video-list__thumb">
                      {id ? (
                        <img
                          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <i className="bi bi-youtube" aria-hidden="true" />
                      )}
                    </span>
                    <span className="video-list__meta">
                      <span className="video-list__url">{video.url}</span>
                      {video.createdAt && (
                        <small className="text-muted">
                          Added {new Date(video.createdAt).toLocaleDateString()}
                        </small>
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
