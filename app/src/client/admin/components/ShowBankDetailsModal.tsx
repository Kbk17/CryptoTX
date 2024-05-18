import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ShowBankDetailsModal = ({ bankDetails, isOpen, onRequestClose }) => {
  if (!bankDetails) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Bank Details Modal"
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
      overlayClassName="Overlay"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
        <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
        <p><strong>IBAN:</strong> {bankDetails.iban}</p>
        <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
        <p><strong>Bank Address:</strong> {bankDetails.bankAddress}</p>
        <p><strong>SWIFT:</strong> {bankDetails.swift}</p>
        <button onClick={onRequestClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">Close</button>
      </div>
    </Modal>
  );
};

export default ShowBankDetailsModal;
