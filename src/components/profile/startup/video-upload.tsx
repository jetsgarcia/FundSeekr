"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadVideoFile, deleteVideo } from "@/actions/video-upload";
import { useStartupVideos } from "@/hooks/use-startup-videos";

interface VideoUploadProps {
  startupId: string;
}

export function VideoUpload({ startupId }: VideoUploadProps) {
  const { videos, loading, error, refetch } = useStartupVideos(startupId);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      toast.error("Video file must be smaller than 100MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || !description.trim()) {
      toast.error("Please fill in all fields and select a video file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("startupId", startupId);

      const result = await uploadVideoFile(formData);

      if (result.success) {
        toast.success("Video uploaded successfully!");
        setTitle("");
        setDescription("");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          "video-file"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Refresh videos list
        refetch();
      } else {
        toast.error(result.error || "Failed to upload video");
      }
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId: number) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    setDeleting(videoId);

    try {
      const result = await deleteVideo(videoId);

      if (result.success) {
        toast.success("Video deleted successfully!");
        refetch();
      } else {
        toast.error(result.error || "Failed to delete video");
      }
    } catch (error) {
      console.error("Video delete error:", error);
      toast.error("Failed to delete video");
    } finally {
      setDeleting(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Pitches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Pitches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              maxLength={255}
            />
          </div>

          <div>
            <Label htmlFor="video-description">Description</Label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video pitch"
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="video-file">Video File</Label>
            <Input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={
              uploading || !selectedFile || !title.trim() || !description.trim()
            }
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </div>

        {/* Existing Videos */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading videos...</span>
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Uploaded Videos ({videos.length})</h4>
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h5 className="font-medium">{video.title}</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>
                        Duration: {formatDuration(video.duration_in_seconds)}
                      </span>
                      <span>Status: {video.pitch_status}</span>
                      {video.video_url && (
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Video
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={deleting === video.id}
                    onClick={() => handleDelete(video.id)}
                  >
                    {deleting === video.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No videos uploaded yet</p>
            <p className="text-sm">Upload your first video pitch above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
