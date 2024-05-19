import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getPaginatedAdminTransactions, useQuery } from 'wasp/client/operations';
import EditTransactionModal from './EditTransactionModal';
import Loader from '../common/Loader';
import { FaSearch, FaFilter } from 'react-icons/fa';

Modal.setAppElement('#root');

interface Transaction {
  transactionId: number;
  paymentId: string;
  userEmail: string;
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
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>(undefined);
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>(undefined);
  const [modifiedByEmail, setModifiedByEmail] = useState<string | undefined>(undefined);
  const [modifiedDateFrom, setModifiedDateFrom] = useState<Date | undefined>(undefined);
  const [modifiedDateTo, setModifiedDateTo] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState({
    paymentId: '',
    userEmail: '',
    status: '',
    createdAtFrom: '',
    createdAtTo: '',
    modifiedByEmail: '',
    modifiedDateFrom: '',
    modifiedDateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data, isLoading, error } = useQuery(getPaginatedAdminTransactions, {
    skip,
    paymentIdContains: paymentId,
    userEmailContains: userEmail,
    status,
    createdAtFrom,
    createdAtTo,
    modifiedByEmail,
    modifiedDateFrom,
    modifiedDateTo
  });

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  const applyFilters = () => {
    setPaymentId(filters.paymentId || undefined);
    setUserEmail(filters.userEmail || undefined);
    setStatus(filters.status || undefined);
    setCreatedAtFrom(filters.createdAtFrom ? new Date(filters.createdAtFrom) : undefined);
    setCreatedAtTo(filters.createdAtTo ? new Date(filters.createdAtTo) : undefined);
    setModifiedByEmail(filters.modifiedByEmail || undefined);
    setModifiedDateFrom(filters.modifiedDateFrom ? new Date(filters.modifiedDateFrom) : undefined);
    setModifiedDateTo(filters.modifiedDateTo ? new Date(filters.modifiedDateTo) : undefined);
    setPage(1);
  };

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTransaction(null);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between p-4 w-full bg-gray-100/40 dark:bg-gray-700/50">
          <span className="text-sm font-medium">Filters:</span>
          <button
            className="block lg:hidden p-2 bg-primary text-white rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
          </button>
        </div>
        <div className={`p-4 lg:flex items-center justify-between gap-3 w-full ${showFilters ? 'block' : 'hidden'} lg:flex`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="paymentId-filter" className="block text-sm text-gray-700 dark:text-white">
                Payment ID:
              </label>
              <input
                type="text"
                id="paymentId-filter"
                placeholder="Payment ID"
                value={filters.paymentId}
                onChange={(e) => setFilters({ ...filters, paymentId: e.currentTarget.value })}
                className="w-32 rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="userEmail-filter" className="block text-sm text-gray-700 dark:text-white">
                User Email:
              </label>
              <input
                type="text"
                id="userEmail-filter"
                placeholder="User Email"
                value={filters.userEmail}
                onChange={(e) => setFilters({ ...filters, userEmail: e.currentTarget.value })}
                className="w-32 rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="status-filter" className="block text-sm text-gray-700 dark:text-white">
                Status:
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.currentTarget.value })}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="createdAtFrom-filter" className="block text-sm text-gray-700 dark:text-white">
                From:
              </label>
              <input
                type="datetime-local"
                id="createdAtFrom-filter"
                value={filters.createdAtFrom}
                onChange={(e) => setFilters({ ...filters, createdAtFrom: e.currentTarget.value })}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="createdAtTo-filter" className="block text-sm text-gray-700 dark:text-white">
                To:
              </label>
              <input
                type="datetime-local"
                id="createdAtTo-filter"
                value={filters.createdAtTo}
                onChange={(e) => setFilters({ ...filters, createdAtTo: e.currentTarget.value })}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="modifiedByEmail-filter" className="block text-sm text-gray-700 dark:text-white">
                Modified By:
              </label>
              <input
                type="text"
                id="modifiedByEmail-filter"
                placeholder="Modified By Email"
                value={filters.modifiedByEmail}
                onChange={(e) => setFilters({ ...filters, modifiedByEmail: e.currentTarget.value })}
                className="w-32 rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="modifiedDateFrom-filter" className="block text-sm text-gray-700 dark:text-white">
                From:
              </label>
              <input
                type="datetime-local"
                id="modifiedDateFrom-filter"
                value={filters.modifiedDateFrom}
                onChange={(e) => setFilters({ ...filters, modifiedDateFrom: e.currentTarget.value })}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <label htmlFor="modifiedDateTo-filter" className="block text-sm text-gray-700 dark:text-white">
                To:
              </label>
              <input
                type="datetime-local"
                id="modifiedDateTo-filter"
                value={filters.modifiedDateTo}
                onChange={(e) => setFilters({ ...filters, modifiedDateTo: e.currentTarget.value })}
                className="rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <button
              onClick={applyFilters}
              className="ml-2 p-2 bg-primary text-white rounded-md flex items-center"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.userEmail}</td>
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
