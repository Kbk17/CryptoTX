import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAction, editTransaction } from 'wasp/client/operations';

Modal.setAppElement('#root');

const statuses = [
  { value: 'New', label: 'New' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Failed', label: 'Failed' },
];

const EditTransactionModal = ({ transaction, isOpen, onRequestClose }) => {
  const [fiatAmount, setFiatAmount] = useState(transaction?.fiatAmount || 0);
  const [cryptoCurrency, setCryptoCurrency] = useState(transaction?.cryptoCurrency || '');
  const [cryptoCurrencyAmount, setCryptoCurrencyAmount] = useState(transaction?.cryptoCurrencyAmount || 0);
  const [walletAddress, setWalletAddress] = useState(transaction?.walletAddress || '');
  const [status, setStatus] = useState(transaction?.status || statuses[0].value);
  const [commission, setCommission] = useState(transaction?.commission || 0);
  const [rate, setRate] = useState(transaction?.rate || 0);

  useEffect(() => {
    if (transaction) {
      setFiatAmount(transaction.fiatAmount);
      setCryptoCurrency(transaction.cryptoCurrency);
      setCryptoCurrencyAmount(transaction.cryptoCurrencyAmount);
      setWalletAddress(transaction.walletAddress);
      setStatus(transaction.status);
      setCommission(transaction.commission);
      setRate(transaction.rate);
    }
  }, [transaction]);

  const editTransactionAction = useAction(editTransaction);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTransactionAction({
        transactionId: transaction.transactionId,
        updates: {
          fiatAmount,
          cryptoCurrency,
          cryptoCurrencyAmount,
          walletAddress,
          status,
          commission,
          rate,
        },
      });
      onRequestClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Transaction Modal"
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
      overlayClassName="Overlay"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fiatAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fiat Amount</label>
            <input type="number" id="fiatAmount" value={fiatAmount} onChange={(e) => setFiatAmount(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="cryptoCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Crypto Currency</label>
            <input type="text" id="cryptoCurrency" value={cryptoCurrency} onChange={(e) => setCryptoCurrency(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="cryptoCurrencyAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Crypto Currency Amount</label>
            <input type="number" id="cryptoCurrencyAmount" value={cryptoCurrencyAmount} onChange={(e) => setCryptoCurrencyAmount(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Wallet Address</label>
            <input type="text" id="walletAddress" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="commission" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Commission</label>
            <input type="number" id="commission" value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rate</label>
            <input type="number" id="rate" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onRequestClose} className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50">Save</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditTransactionModal;
