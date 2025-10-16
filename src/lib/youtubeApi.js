const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchVideos = async (query, maxResults = 10, pageToken = '') => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${query}&maxResults=${maxResults}&type=video&key=${API_KEY}&pageToken=${pageToken}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};

export const getChannelVideos = async (channelId, maxResults = 10, pageToken = '') => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&key=${API_KEY}&pageToken=${pageToken}&order=date`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return null;
  }
};

export const getVideoCategories = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/videoCategories?part=snippet&regionCode=DE&key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return null;
  }
};

