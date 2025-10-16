import React from 'react';

const VideoCard = ({ video }) => {
  if (!video || !video.snippet) return null;

  const { title, thumbnails, channelTitle } = video.snippet;
  const videoId = video.id.videoId;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 duration-300">
      <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
        <img 
          src={thumbnails.medium.url}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600">{channelTitle}</p>
        </div>
      </a>
    </div>
  );
};

export default VideoCard;

