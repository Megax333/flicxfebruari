export interface Promo {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  platform: 'twitter' | 'facebook' | 'youtube' | 'instagram';
  content: string;
  thumbnail: string;
  description: string;
  reward: number;
  remaining: number;
  interactions: number;
  createdAt: string;
}

export interface PromoSubmission {
  id: string;
  promoId: string;
  userId: string;
  proof: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}