import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVideoForm = ({ onVideoAdded }) => {
  const [formData, setFormData] = useState({ link: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedLink = formData.link.trim();

    if (!trimmedLink) {
      toast.error("Please enter a valid YouTube URL.");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/videos`, { link: trimmedLink });

      // Show backend success message
      toast.success(res.data.message);

      // Update parent component
      onVideoAdded(res.data.video);

      // Reset form
      setFormData({ link: "" });

      // Navigate after 2 seconds so toast is visible
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error adding video:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      else {
        toast.success("Video added successfully!");
        navigate("/");
      }
    }
  };

  return (
    <>
      <form className="p-4 shadow rounded bg-white mb-4" onSubmit={handleSubmit}>
        <h4 className="mb-3">Upload Url of Video</h4>
        <div className="mb-3">
          <input
            type="text"
            name="link"
            placeholder="https://www.youtube.com/..."
            className="form-control"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Video</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddVideoForm;
