import React, { useState, useEffect, useCallback } from 'react';
import { searchVideos, getVideoCategories } from './lib/youtubeApi';
import VideoCard from './components/VideoCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import { Button } from './components/ui/button';
import { Moon, Sun, Sparkles } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  KKKiste
                </h1>
                <p className="text-xs text-muted-foreground">Deine Video-Welt</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full w-10 h-10 hover:scale-110 transition-transform"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Willkommen bei KKKiste! 👋
          </h2>
          <p className="text-lg text-muted-foreground">
            Entdecke tolle Videos für Kinder - Kinderlieder, Lernvideos und vieles mehr!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryFilter 
              categories={categories}
              onSelectCategory={handleSelectCategory}
              selectedCategory={selectedCategory}
            />
          </div>
        )}

        {/* Status Messages */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-muted-foreground">Videos werden geladen...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}
        
        {usingStaticData && !error && (
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 mb-8">
            <p className="text-accent-foreground text-center">
              ℹ️ YouTube API-Kontingent überschritten. Es werden statische Videos angezeigt.
            </p>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading && videos.map((video, index) => (
            <div 
              key={video.id.videoId} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {videos.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground">
              Keine Videos gefunden, die deinen Kriterien entsprechen.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Versuche es mit einem anderen Suchbegriff!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            &copy; 2025 KKKiste. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs mt-2 opacity-80">
            Mit ❤️ für Kinder gemacht
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

