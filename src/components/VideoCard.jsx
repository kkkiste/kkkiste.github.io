import React from 'react';
import { Card, CardContent } from './ui/card';
import { Play } from 'lucide-react';

const VideoCard = ({ video }) => {
  if (!video || !video.snippet) return null;

  const { title, thumbnails, channelTitle } = video.snippet;
  const videoId = video.id.videoId;

  return (
    <Card className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <a 
        href={`https://www.youtube.com/watch?v=${videoId}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={thumbnails.medium.url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/0 group-hover:bg-primary flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-base font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {channelTitle}
          </p>
        </CardContent>
      </a>
    </Card>
  );
};

export default VideoCard;

