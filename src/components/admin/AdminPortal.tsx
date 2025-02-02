import React from 'react';
import { createPortal } from 'react-dom';

interface AdminPortalProps {
  children: React.ReactNode;
}

const AdminPortal = ({ children }: AdminPortalProps) => {
  return createPortal(
    children,
    document.body
  );
};

export default AdminPortal;