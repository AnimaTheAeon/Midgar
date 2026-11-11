import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import AuthenticationRequiredModalContent from './AuthenticationRequiredModalContent';

interface AuthenticationRequiredModalProps {
  isOpen: boolean;
  onModalClose: () => void;
}

// Midgar: Cancel (or Esc) closes this until Midgar next starts; the same
// settings are in Settings > General > Security.
export default function AuthenticationRequiredModal({
  isOpen,
  onModalClose,
}: AuthenticationRequiredModalProps) {
  return (
    <Modal
      size={sizes.MEDIUM}
      isOpen={isOpen}
      closeOnBackgroundClick={false}
      onModalClose={onModalClose}
    >
      <AuthenticationRequiredModalContent onModalClose={onModalClose} />
    </Modal>
  );
}
