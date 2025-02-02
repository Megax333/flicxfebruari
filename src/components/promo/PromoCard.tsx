import React from 'react';
import { Twitter, Facebook, Youtube, Instagram, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import CoinIcon from '../CoinIcon';
import type { Promo } from '../../types/promo';

interface PromoCardProps {
  promo: Promo;
}

const PromoCard = ({ promo }: PromoCardProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="text-[#1DA1F2]" />;
      case 'facebook': return <Facebook className="text-[#4267B2]" />;
      case 'youtube': return <Youtube className="text-[#FF0000]" />;
      case 'instagram': return <Instagram className="text-[#E4405F]" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#1E1E2A] rounded-lg p-4 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src={promo.author.avatar}
            alt={promo.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-medium truncate">{promo.author.name}</div>
            <div className="text-sm text-gray-400">
              {getPlatformIcon(promo.platform)}
              <span className="ml-1">{promo.platform}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-600/20 px-2.5 py-1 rounded-full">
          <CoinIcon size={16} />
          <span className="text-sm">{promo.reward} XCE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-sm text-gray-300 mb-2 line-clamp-2 flex-shrink-0">{promo.description}</p>
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={promo.thumbnail}
            alt="Content preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm">
              {getPlatformIcon(promo.platform)}
              <span>View on {promo.platform}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 flex-shrink-0">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{promo.interactions}↗</span>
          <span>{promo.remaining} left</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#2A2A3A] hover:bg-[#3A3A4A] w-20 h-8 rounded-lg text-sm flex items-center justify-center gap-1.5">
            <ExternalLink size={16} />
            Visit
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 w-28 h-8 rounded-lg text-sm">
            Submit Proof
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;