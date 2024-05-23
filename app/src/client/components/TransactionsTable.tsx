import React, { useState, useEffect } from 'react';
import { useQuery, getPaginatedTransactions, getBankDetailsById } from 'wasp/client/operations';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

interface FiatCurrency {
  currencyCode: string;
}

interface Transaction {
  transactionId: number;
  paymentId: string;
  fiatAmount: number;
  cryptoCurrency: string;
  cryptoCurrencyAmount: number;
  walletAddress: string;
  status: string;
  createdAt: Date;
  fiatCurrency: FiatCurrency;
  bankDetailsId: number; // Ensure this is included
}

interface TransactionsData {
  transactions: Transaction[];
  totalPages: number;
}

const TransactionsTable = () => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>(undefined);
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState({ paymentId: '', status: '', createdAtFrom: '', createdAtTo: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [selectedBankDetailsId, setSelectedBankDetailsId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery(getPaginatedTransactions, {
    skip,
    paymentId: paymentId ? `%${paymentId}%` : undefined,
    status,
    createdAtFrom,
    createdAtTo,
  });

  const { data: bankData, refetch: fetchBankDetails } = useQuery(getBankDetailsById, {
    id: selectedBankDetailsId,
  }, {
    enabled: !!selectedBankDetailsId, // Enable fetching only when bankDetailsId is set
  });

  useEffect(() => {
    if (bankData) {
      setBankDetails(bankData);
    }
  }, [bankData]);

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  const applyFilters = () => {
    setPaymentId(filters.paymentId || undefined);
    setStatus(filters.status || undefined);
    setCreatedAtFrom(filters.createdAtFrom ? new Date(filters.createdAtFrom) : undefined);
    setCreatedAtTo(filters.createdAtTo ? new Date(filters.createdAtTo) : undefined);
    setPage(1);
  };

  const handleShowBankDetails = (bankDetailsId: number) => {
    if (selectedBankDetailsId === bankDetailsId) {
      // If the same ID is clicked again, toggle off
      setSelectedBankDetailsId(null);
      setBankDetails(null);
    } else {
      setSelectedBankDetailsId(bankDetailsId);
    }
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiat Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.fiatAmount.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.cryptoCurrencyAmount.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{transaction.walletAddress}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.status === 'Completed' ? 'text-green-500' : 'text-red-500'} dark:text-gray-300`}>{transaction.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-blue-500 dark:text-blue-400"
                      onClick={() => handleShowBankDetails(transaction.bankDetailsId)}
                    >
                      Show Bank Details
                    </button>
                    {bankDetails && selectedBankDetailsId === transaction.bankDetailsId && (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                        <p>Account Name: {bankDetails.accountName}</p>
                        <p>IBAN: {bankDetails.iban}</p>
                        <p>Bank Name: {bankDetails.bankName}</p>
                        <p>Bank Address: {bankDetails.bankAddress}</p>
                        <p>SWIFT: {bankDetails.swift}</p>
                      </div>
                    )}
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
    </div>
  );
};

export default TransactionsTable;
