import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { toast } from "sonner";

function useVideo(id) {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data.data.video);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load video");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/videos/${id}`);
      toast.success("Video deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
      setDeleting(false);
    }
  };

  return { video, loading, deleting, handleDelete };
}

export default useVideo;
