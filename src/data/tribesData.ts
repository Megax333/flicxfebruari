import { Palette, Music, Heart, Brain, Code, Camera, Globe } from 'lucide-react';

export const tribes = [
  { 
    id: 'animation',
    name: 'Animation',
    icon: Palette,
    members: 25600,
    online: 1234,
    color: 'from-purple-500 to-pink-500',
    description: 'A community for animation artists and enthusiasts',
    trending: [
      { tag: 'CharacterDesign', posts: 156 },
      { tag: 'Animation2D', posts: 89 },
      { tag: 'MotionGraphics', posts: 67 }
    ]
  },
  { 
    id: 'music',
    name: 'Music',
    icon: Music,
    members: 18400,
    online: 892,
    color: 'from-blue-500 to-cyan-500',
    description: 'Share and discuss music production and sound design',
    trending: [
      { tag: 'SoundDesign', posts: 134 },
      { tag: 'Composition', posts: 98 },
      { tag: 'AudioPost', posts: 76 }
    ]
  },
  { 
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: Heart,
    members: 15200,
    online: 567,
    color: 'from-rose-500 to-orange-500',
    description: 'Creative lifestyle and work-life balance discussions',
    trending: [
      { tag: 'WorkLife', posts: 145 },
      { tag: 'CreativeSpace', posts: 87 },
      { tag: 'Productivity', posts: 65 }
    ]
  },
  { 
    id: 'ai',
    name: 'AI',
    icon: Brain,
    members: 12800,
    online: 789,
    color: 'from-green-500 to-emerald-500',
    description: 'Exploring AI in creative industries',
    trending: [
      { tag: 'AIArt', posts: 234 },
      { tag: 'MachineLearning', posts: 156 },
      { tag: 'GenerativeAI', posts: 123 }
    ]
  },
  { 
    id: 'tech',
    name: 'Tech',
    icon: Code,
    members: 21300,
    online: 1123,
    color: 'from-blue-600 to-indigo-500',
    description: 'Technical discussions and development topics',
    trending: [
      { tag: 'WebDev', posts: 189 },
      { tag: 'CreativeCoding', posts: 145 },
      { tag: 'GameDev', posts: 112 }
    ]
  },
  { 
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    members: 19700,
    online: 678,
    color: 'from-amber-500 to-yellow-500',
    description: 'Photography techniques and visual storytelling',
    trending: [
      { tag: 'Composition', posts: 167 },
      { tag: 'Lighting', posts: 134 },
      { tag: 'PostProcess', posts: 98 }
    ]
  },
  { 
    id: 'travel',
    name: 'Travel',
    icon: Globe,
    members: 16900,
    online: 456,
    color: 'from-teal-500 to-cyan-500',
    description: 'Travel photography and location scouting',
    trending: [
      { tag: 'LocationScout', posts: 145 },
      { tag: 'TravelTips', posts: 123 },
      { tag: 'Wanderlust', posts: 89 }
    ]
  }
];