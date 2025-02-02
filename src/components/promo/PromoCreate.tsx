import React from 'react';
import { X, Link, Upload } from 'lucide-react';

interface PromoCreateProps {
  onClose: () => void;
}

const PromoCreate = ({ onClose }: PromoCreateProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2A] rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Promo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select className="w-full bg-[#2A2A3A] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content URL</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="https://"
                className="flex-1 bg-[#2A2A3A] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button className="bg-[#2A2A3A] p-3 rounded-xl">
                <Link size={20} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              rows={3}
              placeholder="Tell people why they should engage with your content..."
              className="w-full bg-[#2A2A3A] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reward per Interaction</label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                min="1"
                placeholder="50"
                className="w-32 bg-[#2A2A3A] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <span>XCE</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl hover:bg-white/5"
          >
            Cancel
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl">
            Create Promo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCreate;