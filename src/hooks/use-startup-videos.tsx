"use client";

import { useState, useEffect } from "react";
import { getStartupVideos } from "@/actions/video-upload";

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string | null;
  duration_in_seconds: number;
  pitch_status: string;
  date_sent: Date | null;
}

export function useStartupVideos(startupId: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const result = await getStartupVideos(startupId);

      if (result.success) {
        setVideos(result.videos || []);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch videos");
        setVideos([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startupId) {
      fetchVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId]);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos,
  };
}
