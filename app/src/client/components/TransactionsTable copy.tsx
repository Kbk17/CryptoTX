import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useQuery, useAction, getPaginatedTransactions, getBankDetailsByCurrency } from 'wasp/client/operations';

Modal.setAppElement('#root');

interface FiatCurrency {
  currencyCode: string;
}

interface Transaction {
  transactionId: string;
  fiatAmount: number;
  cryptoCurrency: string;
  cryptoCurrencyAmount: number;
  status: string;
  createdAt: Date;
  fiatCurrency: FiatCurrency;
}

interface TransactionsData {
  transactions: Transaction[];
  totalPages: number;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  iban: string;
  swift: string;
}

const TransactionsTable = () => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [userId] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  const { data, isLoading, error } = useQuery(getPaginatedTransactions, {
    skip,
    userId,
  });

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiat Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data?.transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{new Date(transaction.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.fiatAmount.toString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrencyAmount.toString()}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.status === 'completed' ? 'text-green-500' : 'text-red-500'} dark:text-gray-300`}>{transaction.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => openModal()} className="text-blue-500 dark:text-blue-400">
                    Show Bank Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && data.totalPages > 1 && (
        <div className="flex justify-between p-4">
          <button onClick={() => setPage(page => Math.max(page - 1, 1))} className="px-4 py-2 bg-primary text-white rounded-md">
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.totalPages}
          </span>
          <button onClick={() => setPage(page => Math.min(page + 1, data.totalPages))} className="px-4 py-2 bg-primary text-white rounded-md">
            Next
          </button>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Bank Details Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
        overlayClassName="Overlay"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
          {bankDetails ? (
            <div className="space-y-2">
              <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
              <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
              <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
              <p><strong>IBAN:</strong> {bankDetails.iban}</p>
              <p><strong>SWIFT:</strong> {bankDetails.swift}</p>
            </div>
          ) : (
            <p>Loading bank details...</p>
          )}
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsTable;
