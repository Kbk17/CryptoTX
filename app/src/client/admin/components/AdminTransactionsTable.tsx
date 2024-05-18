import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getPaginatedAdminTransactions, useQuery } from 'wasp/client/operations';
import EditTransactionModal from './EditTransactionModal';
import Loader from '../common/Loader';

Modal.setAppElement('#root');

interface Transaction {
  transactionId: string;
  userId: number;
  fiatAmount: number;
  cryptoCurrency: string;
  cryptoCurrencyAmount: number;
  walletAddress: string;
  status: string;
  commission: number;
  rate: number;
  createdAt: Date;
  lastChangeDate: Date;
  lastModifiedByUserId: number;
  lastModifiedByEmail: string;
}

interface TransactionsData {
  transactions: Transaction[];
  totalPages: number;
}

const AdminTransactionsTable = () => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [transactionId, setTransactionId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data, isLoading, error } = useQuery(getPaginatedAdminTransactions, {
    skip,
    transactionIdContains: transactionId,
    userId,
    status,
  });

  useEffect(() => {
    setPage(1);
  }, [transactionId, userId, status]);

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex-col flex items-start justify-between p-6 gap-3 w-full bg-gray-100/40 dark:bg-gray-700/50">
          <span className="text-sm font-medium">Filters:</span>
          <div className="flex items-center justify-between gap-3 w-full px-2">
            <div className="relative flex items-center gap-3 ">
              <label htmlFor="transactionId-filter" className="block text-sm text-gray-700 dark:text-white">
                Transaction ID:
              </label>
              <input
                type="text"
                id="transactionId-filter"
                placeholder="Transaction ID"
                onChange={(e) => {
                  setTransactionId(e.currentTarget.value);
                }}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <label htmlFor="userId-filter" className="block text-sm ml-2 text-gray-700 dark:text-white">
                User ID:
              </label>
              <input
                type="number"
                id="userId-filter"
                placeholder="User ID"
                onChange={(e) => {
                  setUserId(e.currentTarget.valueAsNumber);
                }}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <label htmlFor="status-filter" className="block text-sm ml-2 text-gray-700 dark:text-white">
                Status:
              </label>
              <select
                id="status-filter"
                onChange={(e) => {
                  setStatus(e.currentTarget.value);
                }}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Status</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {!isLoading && (
              <div className="max-w-60">
                <span className="text-md mr-2 text-black dark:text-white">page</span>
                <input
                  type="number"
                  value={page}
                  min={1}
                  max={data?.totalPages}
                  onChange={(e) => {
                    setPage(parseInt(e.currentTarget.value));
                  }}
                  className="rounded-md border-1 border-stroke bg-transparent  px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="text-md text-black dark:text-white"> / {data?.totalPages} </span>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TransactionId</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UserId</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiat Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Change Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified By Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.fiatAmount.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrencyAmount.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.walletAddress}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.status === 'Completed' ? 'text-green-500' : 'text-red-500'} dark:text-gray-300`}>{transaction.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.commission.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.rate.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{new Date(transaction.lastChangeDate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.lastModifiedByEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    <a href="#" onClick={() => openModal(transaction)} className="text-blue-500 hover:underline">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && <Loader />}
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
      </div>
      <EditTransactionModal
        transaction={selectedTransaction}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      />
    </div>
  );
};

export default AdminTransactionsTable;
