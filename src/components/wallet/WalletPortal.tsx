import React from 'react';
import { createPortal } from 'react-dom';
import WalletModal from './WalletModal';

interface WalletPortalProps {
  onClose: () => void;
}

const WalletPortal = ({ onClose }: WalletPortalProps) => {
  return createPortal(
    <WalletModal onClose={onClose} />,
    document.body
  );
};

export default WalletPortal;