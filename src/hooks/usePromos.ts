import { useState, useEffect } from 'react';
import type { Promo } from '../types/promo';

const generateMorePromos = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    author: {
      id: String(Math.floor(Math.random() * 5) + 1),
      name: ['Sarah Chen', 'Marcus Rodriguez', 'Emma Wilson', 'David Kim', 'Lisa Brown'][Math.floor(Math.random() * 5)],
      avatar: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
      ][Math.floor(Math.random() * 5)]
    },
    thumbnail: [
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=400&fit=crop', // Sci-fi scene
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop', // Digital art
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=400&fit=crop', // Animation still
      'https://images.unsplash.com/photo-1626785774459-c879f1ea4a47?w=800&h=400&fit=crop', // Creative work
      'https://images.unsplash.com/photo-1614729939124-032d0bd5d11b?w=800&h=400&fit=crop'  // Abstract digital
    ][Math.floor(Math.random() * 5)],
    platform: ['twitter', 'youtube', 'facebook', 'instagram'][Math.floor(Math.random() * 4)],
    content: `https://example.com/${Date.now()}`,
    description: [
      'Check out my latest creative work! Looking for feedback and engagement.',
      'New video showcase! Share and comment for rewards.',
      'Behind the scenes look at our latest project!',
      'Join our creative community discussion!',
      'Special preview of upcoming content!'
    ][Math.floor(Math.random() * 5)],
    reward: Math.floor(Math.random() * 76) + 25,
    remaining: Math.floor(Math.random() * 3000) + 1000,
    interactions: Math.floor(Math.random() * 200) + 50,
    createdAt: new Date().toISOString()
  }));
};

export const usePromos = () => {
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: '1',
      author: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      platform: 'twitter',
      content: 'https://twitter.com/example/status/123456789',
      thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=400&fit=crop',
      description: 'Check out my latest animation work! Looking for feedback and engagement.',
      reward: 50,
      remaining: 2500,
      interactions: 150,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Marcus Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      },
      platform: 'youtube',
      content: 'https://youtube.com/watch?v=example',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
      description: 'New VFX breakdown video! Share and comment for rewards.',
      reward: 75,
      remaining: 3750,
      interactions: 89,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      author: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      platform: 'facebook',
      content: 'https://facebook.com/post/example',
      thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=400&fit=crop',
      description: 'Behind the scenes look at our latest project!',
      reward: 60,
      remaining: 3000,
      interactions: 120,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      author: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      },
      platform: 'twitter',
      content: 'https://twitter.com/example/status/987654321',
      thumbnail: 'https://images.unsplash.com/photo-1626785774459-c879f1ea4a47?w=800&h=400&fit=crop',
      description: 'Join our creative community discussion!',
      reward: 45,
      remaining: 2250,
      interactions: 95,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      author: {
        id: '4',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      },
      platform: 'instagram',
      content: 'https://instagram.com/p/example',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
      description: 'New art series reveal! Double tap to show your support ❤️',
      reward: 55,
      remaining: 2800,
      interactions: 210,
      createdAt: new Date().toISOString()
    },
    {
      id: '8',
      author: {
        id: '4',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      },
      platform: 'youtube',
      content: 'https://youtube.com/watch?v=example2',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
      description: 'Exclusive preview of our upcoming animation series!',
      reward: 80,
      remaining: 4000,
      interactions: 175,
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      author: {
        id: '5',
        name: 'Lisa Brown',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
      },
      platform: 'facebook',
      content: 'https://facebook.com/post/example2',
      thumbnail: 'https://images.unsplash.com/photo-1614729939124-032d0bd5d11b?w=800&h=400&fit=crop',
      description: 'Interactive art showcase - participate and earn rewards!',
      reward: 65,
      remaining: 2800,
      interactions: 145,
      createdAt: new Date().toISOString()
    },
    {
      id: '7',
      author: {
        id: '4',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      },
      platform: 'youtube',
      content: 'https://youtube.com/watch?v=example2',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
      description: 'Exclusive preview of our upcoming animation series!',
      reward: 80,
      remaining: 4000,
      interactions: 175,
      createdAt: new Date().toISOString()
    },
    {
      id: '9',
      author: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      },
      platform: 'instagram',
      content: 'https://instagram.com/p/example2',
      thumbnail: 'https://images.unsplash.com/photo-1614729939124-032d0bd5d11b?w=800&h=400&fit=crop',
      description: 'New art series sneak peek! Double tap to support 🎨',
      reward: 70,
      remaining: 3200,
      interactions: 165,
      createdAt: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const generateBatch = () => {
    // Calculate how many promos needed to complete a row of 3
    const currentCount = promos.length;
    const remainder = currentCount % 3;
    const extraNeeded = remainder === 0 ? 12 : 12 + (3 - remainder);
    
    return Array.from({ length: extraNeeded }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      author: {
        id: String(Math.floor(Math.random() * 5) + 1),
        name: ['Sarah Chen', 'Marcus Rodriguez', 'Emma Wilson', 'David Kim', 'Lisa Brown'][Math.floor(Math.random() * 5)],
        avatar: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
        ][Math.floor(Math.random() * 5)]
      },
      thumbnail: [
        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1626785774459-c879f1ea4a47?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1614729939124-032d0bd5d11b?w=800&h=400&fit=crop'
      ][Math.floor(Math.random() * 5)],
      platform: ['twitter', 'youtube', 'facebook', 'instagram'][Math.floor(Math.random() * 4)],
      content: `https://example.com/${Date.now()}`,
      description: [
        'Check out my latest creative work! Looking for feedback and engagement.',
        'New video showcase! Share and comment for rewards.',
        'Behind the scenes look at our latest project!',
        'Join our creative community discussion!',
        'Special preview of upcoming content!'
      ][Math.floor(Math.random() * 5)],
      reward: Math.floor(Math.random() * 76) + 25,
      remaining: Math.floor(Math.random() * 3000) + 1000,
      interactions: Math.floor(Math.random() * 200) + 50,
      createdAt: new Date().toISOString()
    }));
  };

  const loadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPromos = generateBatch();
      setPromos(prev => [...prev, ...newPromos]);
      setHasMore(promos.length < 100); // Limit to 100 total promos
    } catch (error) {
      console.error('Error loading more promos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { promos, loadMore, hasMore, isLoading };
};