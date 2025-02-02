import React from 'react';
import InnovativeTimeline from '../components/community/InnovativeTimeline';
import FloatingComposer from '../components/thoughts/FloatingComposer';
import Tribes from '../components/community/Tribes';
import TribeInfo from '../components/community/TribeInfo';
import { useViewStore } from '../stores/viewStore';

const CommunityPage = () => {
  const { selectedTribe, setSelectedTribe } = useViewStore();

  return (
    <div className="min-h-screen grid grid-cols-[240px,1fr,240px] gap-6 p-6 pt-20">
      {/* Left Sidebar - Tribes */}
      <div>
        <Tribes onTribeSelect={setSelectedTribe} selectedTribe={selectedTribe} />
      </div>
      
      {/* Main Timeline */}
      <div>
        <InnovativeTimeline tribe={selectedTribe} />
      </div>

      {/* Right Sidebar - Active Tribe Info */}
      <div>
        {selectedTribe && <TribeInfo tribeId={selectedTribe} />}
      </div>
      <FloatingComposer />
    </div>
  );
};

export default CommunityPage;