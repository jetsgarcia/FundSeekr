"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Loader2, Play } from "lucide-react";
import { useStartupVideos } from "@/hooks/use-startup-videos";

interface VideoDisplayProps {
  startupId: string;
}

export function VideoDisplay({ startupId }: VideoDisplayProps) {
  const { videos, loading, error } = useStartupVideos(startupId);

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
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Pitches ({videos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading videos...
            </span>
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{video.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Duration: {formatDuration(video.duration_in_seconds)}
                      </span>
                      <span className="capitalize">
                        Status: {video.pitch_status}
                      </span>
                    </div>
                  </div>
                  {video.video_url && (
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium ml-4"
                    >
                      <Play className="h-3 w-3" />
                      Watch
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No videos uploaded yet</p>
            <p className="text-xs">
              Videos can be uploaded from the edit profile page
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
