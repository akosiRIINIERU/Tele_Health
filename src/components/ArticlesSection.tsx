import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, BookOpen, Calendar, Clock, User, Star } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ArticlesSectionProps {
  showBookButton?: boolean;
  onBookAppointment?: () => void;
}

export function ArticlesSection({ showBookButton = false, onBookAppointment }: ArticlesSectionProps) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/articles`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'respiratory', 'neurological', 'digestive', 'mental-health'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'respiratory':
        return 'bg-blue-100 text-blue-800';
      case 'neurological':
        return 'bg-purple-100 text-purple-800';
      case 'digestive':
        return 'bg-orange-100 text-orange-800';
      case 'mental-health':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Articles</h2>
        <p className="text-gray-600">Learn about symptoms, treatments, and natural remedies</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-pink-200 focus:border-pink-300"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 text-gray-700 hover:bg-pink-50'
              }`}
            >
              {category === 'all' ? 'All' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {filteredArticles.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-3 bg-white/20 text-white">
                  Featured Article
                </Badge>
                <h3 className="text-xl font-semibold mb-2">{filteredArticles[0].title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {filteredArticles[0].content.substring(0, 150)}...
                </p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>4.8 rating</span>
                  </div>
                </div>
              </div>
              <BookOpen className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(article.category)}`}
                        >
                          {article.category.replace('-', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>5 min read</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {article.content}
                      </p>
                    </div>
                  </div>

                  {/* Herbs Section */}
                  {article.herbs && article.herbs.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recommended Natural Remedies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {article.herbs.map((herb, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            🌿 {herb}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-200 text-pink-600 hover:bg-pink-50"
                      >
                        Save Article
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Share
                      </Button>
                    </div>
                    
                    {showBookButton && onBookAppointment && (
                      <Button
                        size="sm"
                        onClick={onBookAppointment}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        Book Consultation
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Health Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Medical Disclaimer</h4>
          <p className="text-yellow-800 text-sm">
            The information provided in these articles is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting any treatment or taking any herbs or supplements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}