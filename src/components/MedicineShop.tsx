import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, ShoppingCart, Plus, Minus, Star, 
  Pill, Leaf, Package, Truck, Heart 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MedicineShop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'medicine', name: 'Medicines', icon: Pill },
    { id: 'herbs', name: 'Herbal Remedies', icon: Leaf },
    { id: 'vitamins', name: 'Vitamins', icon: Heart }
  ];

  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'medicine',
      price: 25.50,
      originalPrice: 30.00,
      description: 'For fever and pain relief',
      stock: 150,
      rating: 4.8,
      reviews: 234,
      prescription: false,
      image: '/placeholder-medicine.jpg'
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'vitamins',
      price: 45.00,
      originalPrice: null,
      description: 'Immune system support',
      stock: 89,
      rating: 4.6,
      reviews: 156,
      prescription: false,
      image: '/placeholder-vitamins.jpg'
    },
    {
      id: 3,
      name: 'Ginger Root Extract',
      category: 'herbs',
      price: 35.75,
      originalPrice: 40.00,
      description: 'Natural digestive aid and anti-inflammatory',
      stock: 45,
      rating: 4.9,
      reviews: 89,
      prescription: false,
      image: '/placeholder-herbs.jpg'
    },
    {
      id: 4,
      name: 'Ibuprofen 400mg',
      category: 'medicine',
      price: 32.00,
      originalPrice: null,
      description: 'Anti-inflammatory pain reliever',
      stock: 120,
      rating: 4.7,
      reviews: 198,
      prescription: true,
      image: '/placeholder-medicine.jpg'
    },
    {
      id: 5,
      name: 'Echinacea Capsules',
      category: 'herbs',
      price: 28.50,
      originalPrice: 35.00,
      description: 'Natural immune system booster',
      stock: 67,
      rating: 4.5,
      reviews: 78,
      prescription: false,
      image: '/placeholder-herbs.jpg'
    },
    {
      id: 6,
      name: 'Multivitamin Complex',
      category: 'vitamins',
      price: 55.00,
      originalPrice: null,
      description: 'Complete daily nutrition support',
      stock: 95,
      rating: 4.8,
      reviews: 145,
      prescription: false,
      image: '/placeholder-vitamins.jpg'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Shop</h2>
        <p className="text-gray-600">Order medicines and herbal remedies with fast delivery</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medicines, vitamins, herbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-pink-200 focus:border-pink-300"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <Card className="bg-gradient-to-r from-green-500 to-green-400 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Free Delivery</h3>
              <p className="text-green-100">On orders over ₱200</p>
            </div>
            <Truck className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantity = cartItem?.quantity || 0;

          return (
            <Card key={product.id} className="border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Image */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {product.prescription && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          Rx
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Stock */}
                    <p className="text-xs text-gray-500 mt-1">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-pink-600">₱{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₱{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {quantity === 0 ? (
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-8 h-8 p-0 border-pink-200"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.id, 1)}
                          disabled={quantity >= product.stock}
                          className="w-8 h-8 p-0 border-pink-200"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary (Fixed Bottom) */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <Card className="bg-pink-500 text-white border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{getCartItemCount()} items</p>
                    <p className="text-sm text-pink-100">₱{getCartTotal().toFixed(2)} total</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-white text-pink-600 hover:bg-gray-100"
                >
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Important Notice */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-orange-900 mb-2">⚠️ Important Notice</h4>
          <ul className="text-orange-800 text-sm space-y-1">
            <li>• Prescription medicines require valid prescription upload</li>
            <li>• Consult your doctor before starting any new medication</li>
            <li>• Check expiry dates upon delivery</li>
            <li>• Contact our pharmacist for any questions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}