import React, { useState, useEffect, useCallback } from 'react';
import { searchVideos, getVideoCategories } from './lib/youtubeApi';
import VideoCard from './components/VideoCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import './App.css';

const staticVideos = [
  {
    id: { videoId: 'riF8E7wtZH8' },
    snippet: {
      title: 'Kinderlieder - sechs Lieder zum Mitsingen!',
      channelTitle: 'Kinderlieder zum Mitsingen und Bewegen',
      thumbnails: { medium: { url: 'https://i.ytimg.com/vi/riF8E7wtZH8/mqdefault.jpg' } },
    },
  },
  {
    id: { videoId: 'R6KqXS4Ilas' },
    snippet: {
      title: 'KINDERLIEDER-MIX: 60 MINUTEN VOL 2 - 20 unserer beliebtesten Kinderlieder in einem Mix.',
      channelTitle: 'Liederkiste - Kinderlieder zum Mitsingen',
      thumbnails: { medium: { url: 'https://i.ytimg.com/vi/R6KqXS4Ilas/mqdefault.jpg' } },
    },
  },
  {
    id: { videoId: 'N2bs935Eudw' },
    snippet: {
      title: '9 Kinderlieder in 60 Sekunden - Kennst du sie alle? Videos in voller Länge gibt\'s bei Liederkiste!',
      channelTitle: 'Liederkiste - Kinderlieder zum Mitsingen',
      thumbnails: { medium: { url: 'https://i.ytimg.com/vi/N2bs935Eudw/mqdefault.jpg' } },
    },
  },
  {
    id: { videoId: 'iz621fw5pUc' },
    snippet: {
      title: 'Toddlers & Preschool Learning Videos | Fun Educational',
      channelTitle: 'Silly Miss Lily',
      thumbnails: { medium: { url: 'https://i.ytimg.com/vi/iz621fw5pUc/mqdefault.jpg' } },
    },
  },
];

const staticCategories = [
  { id: '1', snippet: { title: 'Kinderlieder' } },
  { id: '2', snippet: { title: 'Lernvideos' } },
  { id: '3', snippet: { title: 'Cartoons' } },
];

function App() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('kinderlieder');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [usingStaticData, setUsingStaticData] = useState(false);

  const filterStaticVideos = useCallback((query, categoryId) => {
    let filtered = staticVideos;

    if (query) {
      filtered = filtered.filter(video => 
        video.snippet.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (categoryId) {
      if (categoryId === '1') {
        filtered = filtered.filter(video => video.snippet.title.toLowerCase().includes('kinderlieder'));
      } else if (categoryId === '2') {
        filtered = filtered.filter(video => video.snippet.title.toLowerCase().includes('learning') || video.snippet.title.toLowerCase().includes('educational'));
      } else if (categoryId === '3') {
        filtered = filtered.filter(video => video.snippet.title.toLowerCase().includes('cartoon') || video.snippet.title.toLowerCase().includes('animation'));
      }
    }
    setVideos(filtered);
  }, []);

  const fetchVideos = useCallback(async (query, categoryId = null) => {
    setLoading(true);
    setError(null);
    setUsingStaticData(false);

    try {
      let apiData;
      if (categoryId) {
        const categoryName = categories.find(cat => cat.id === categoryId)?.snippet.title || '';
        apiData = await searchVideos(`${query} ${categoryName}`.trim(), 20);
      } else {
        apiData = await searchVideos(query, 20);
      }
      
      if (apiData && apiData.items && apiData.items.length > 0) {
        setVideos(apiData.items);
      } else {
        console.warn('API returned no videos, falling back to static data.');
        setVideos(staticVideos);
        setCategories(staticCategories);
        setUsingStaticData(true);
      }
    } catch (err) {
      console.error('Error fetching videos from API, falling back to static data:', err);
      setError('Fehler beim Laden der Videos von YouTube. Es werden statische Videos angezeigt.');
      setVideos(staticVideos);
      setCategories(staticCategories);
      setUsingStaticData(true);
    } finally {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoryData = await getVideoCategories();
        if (categoryData && categoryData.items) {
          setCategories(categoryData.items);
        } else {
          console.warn('API returned no categories, falling back to static categories.');
          setCategories(staticCategories);
        }
        fetchVideos(searchTerm);
      } catch (err) {
        console.error('Error fetching initial data (categories/videos) from API, falling back to static data:', err);
        setError('Fehler beim Laden der Initialdaten von YouTube. Es werden statische Videos und Kategorien angezeigt.');
        setVideos(staticVideos);
        setCategories(staticCategories);
        setUsingStaticData(true);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchVideos, searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
    setSelectedCategory(null);
    if (usingStaticData) {
      filterStaticVideos(query, null);
    } else {
      fetchVideos(query);
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    const currentQuery = searchTerm || 'kinderlieder';
    if (usingStaticData) {
      filterStaticVideos(currentQuery, categoryId);
    } else {
      fetchVideos(currentQuery, categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      <header className="bg-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-4xl font-bold text-purple-600">KKKiste</h1>
        <div className="text-3xl">🌈</div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Willkommen bei KKKiste!</h2>
        <p className="text-gray-700 mb-8">Hier findest du tolle Videos für Kinder.</p>

        <SearchBar onSearch={handleSearch} />
        {categories.length > 0 && (
          <CategoryFilter 
            categories={categories}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        )}

        {loading && <p className="text-center text-lg">Videos werden geladen...</p>}
        {error && <p className="text-center text-red-500 text-lg">Fehler: {error}</p>}
        {usingStaticData && <p className="text-center text-orange-500 text-lg">Hinweis: YouTube API-Kontingent überschritten. Es werden statische Videos angezeigt.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading && !error && videos.map((video) => (
            <VideoCard key={video.id.videoId} video={video} />
          ))}
        </div>
        {videos.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-600">Keine Videos gefunden, die Ihren Kriterien entsprechen.</p>
        )}
      </main>
      <footer className="bg-purple-600 text-white p-4 text-center">
        <p>&copy; 2025 KKKiste. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}

export default App;

