"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2, Trash2, Play, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  uploadVideoFile,
  uploadVideoUrl,
  deleteVideo,
} from "@/actions/video-upload";
import { useStartupVideos } from "@/hooks/use-startup-videos";

interface VideoManagementProps {
  startupId: string;
}

export function VideoManagement({ startupId }: VideoManagementProps) {
  const { videos, loading, error, refetch } = useStartupVideos(startupId);
  const [uploading, setUploading] = useState(false);
  const [uploadingUrl, setUploadingUrl] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // File upload states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // URL upload states
  const [urlTitle, setUrlTitle] = useState("");
  const [urlDescription, setUrlDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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

    // Confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to upload "${title.trim()}"?\n\nFile: ${
        selectedFile.name
      }\nSize: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    if (!confirmed) {
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
          "video-file-edit"
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

  const handleUrlUpload = async () => {
    if (!videoUrl.trim() || !urlTitle.trim() || !urlDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to add this video URL?\n\nTitle: "${urlTitle.trim()}"\nURL: ${videoUrl.trim()}`
    );

    if (!confirmed) {
      return;
    }

    setUploadingUrl(true);

    try {
      const formData = new FormData();
      formData.append("videoUrl", videoUrl.trim());
      formData.append("title", urlTitle.trim());
      formData.append("description", urlDescription.trim());
      formData.append("startupId", startupId);

      const result = await uploadVideoUrl(formData);

      if (result.success) {
        toast.success("Video URL added successfully!");
        setUrlTitle("");
        setUrlDescription("");
        setVideoUrl("");

        // Refresh videos list
        refetch();
      } else {
        toast.error(result.error || "Failed to add video URL");
      }
    } catch (error) {
      console.error("Video URL upload error:", error);
      toast.error("Failed to add video URL");
    } finally {
      setUploadingUrl(false);
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

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h4 className="font-medium">Add New Video</h4>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Add URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video-title-edit">Video Title</Label>
                <Input
                  id="video-title-edit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  maxLength={255}
                />
              </div>
              <div>
                <Label htmlFor="video-file-edit">Video File</Label>
                <Input
                  id="video-file-edit"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="video-description-edit">Description</Label>
              <textarea
                id="video-description-edit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video pitch"
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                rows={3}
              />
            </div>

            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            <Button
              onClick={handleUpload}
              disabled={
                uploading ||
                !selectedFile ||
                !title.trim() ||
                !description.trim()
              }
              size="sm"
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
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="video-url-input">Video URL</Label>
                <Input
                  id="video-url-input"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: YouTube, Vimeo, or any direct video link
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url-title-edit">Video Title</Label>
                  <Input
                    id="url-title-edit"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    placeholder="Enter video title"
                    maxLength={255}
                  />
                </div>
                <div>
                  <Label htmlFor="url-description-edit">Description</Label>
                  <Input
                    id="url-description-edit"
                    value={urlDescription}
                    onChange={(e) => setUrlDescription(e.target.value)}
                    placeholder="Describe your video pitch"
                  />
                </div>
              </div>

              <Button
                onClick={handleUrlUpload}
                disabled={
                  uploadingUrl ||
                  !videoUrl.trim() ||
                  !urlTitle.trim() ||
                  !urlDescription.trim()
                }
                size="sm"
              >
                {uploadingUrl ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Add Video URL
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Existing Videos */}
      <div className="space-y-4">
        <h4 className="font-medium">
          Uploaded Videos {videos.length > 0 && `(${videos.length})`}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2 text-sm">Loading videos...</span>
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : videos.length > 0 ? (
          <div className="space-y-3">
            {videos.map((video) => {
              const isUrlVideo =
                video.video_url &&
                video.video_url.startsWith("http") &&
                !video.video_url.includes("blob.vercel-storage.com");
              const videoSource = isUrlVideo ? "External URL" : "Uploaded File";

              return (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{video.title}</h5>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-full">
                        {isUrlVideo ? (
                          <Link2 className="h-3 w-3" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                        {videoSource}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      {video.duration_in_seconds > 0 && (
                        <span>
                          Duration: {formatDuration(video.duration_in_seconds)}
                        </span>
                      )}
                      <span className="capitalize">
                        Status: {video.pitch_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {video.video_url && (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs"
                      >
                        <Play className="h-3 w-3" />
                        Watch
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      disabled={deleting === video.id}
                      onClick={() => handleDelete(video.id)}
                    >
                      {deleting === video.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No videos uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}
