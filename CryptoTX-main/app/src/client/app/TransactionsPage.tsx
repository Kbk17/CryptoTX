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

const TransactionsTable = ({ userId }: { userId: number }) => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  const { data, isLoading, error } = useQuery<TransactionsData, { skip: number; userId: number }>(
    ({ skip, userId }) => getPaginatedTransactions({ skip, userId }),  // Make sure this function signature matches expected inputs
    { skip, userId }
  );

  const fetchBankDetails = useAction<string, BankDetails>(getBankDetailsByCurrency);

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  const openModal = async (currencyCode: string) => {
    try {
      const details = await fetchBankDetails(currencyCode);
      setBankDetails(details);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
      setBankDetails(null);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setBankDetails(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Date</th>
            <th>Fiat Amount</th>
            <th>Crypto Currency</th>
            <th>Crypto Amount</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data?.transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td>{new Date(transaction.createdAt).toLocaleString()}</td>
              <td>{transaction.fiatAmount.toFixed(2)}</td>
              <td>{transaction.cryptoCurrency}</td>
              <td>{transaction.cryptoCurrencyAmount.toFixed(2)}</td>
              <td>{transaction.status}</td>
              <td>
                <button onClick={() => openModal(transaction.fiatCurrency.currencyCode)}>
                  Show Bank Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data && data.totalPages > 1 && (
        <div>
          <button onClick={() => setPage(page => Math.max(page - 1, 1))}>Prev</button>
          <span> Page {page} of {data.totalPages} </span>
          <button onClick={() => setPage(page => Math.min(page + 1, data.totalPages))}>Next</button>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Bank Details Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Bank Details</h2>
        {bankDetails ? (
          <div>
            <p>Account Name: {bankDetails.accountName}</p>
            <p>Account Number: {bankDetails.accountNumber}</p>
            <p>Bank Name: {bankDetails.bankName}</p>
            <p>IBAN: {bankDetails.iban}</p>
            <p>SWIFT: {bankDetails.swift}</p>
          </div>
        ) : (
          <p>Loading bank details...</p>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default TransactionsTable;