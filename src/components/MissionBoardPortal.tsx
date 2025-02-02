import React from 'react';
import { createPortal } from 'react-dom';
import MissionBoard from './MissionBoard';

interface MissionBoardPortalProps {
  onClose: () => void;
}

const MissionBoardPortal = ({ onClose }: MissionBoardPortalProps) => {
  return createPortal(
    <MissionBoard onClose={onClose} />,
    document.body
  );
};

export default MissionBoardPortal;