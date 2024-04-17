import React, { useState, useEffect } from 'react';
import { useQuery, getPaginatedTransactions } from 'wasp/client/operations';
import Loader from '../admin/common/Loader';
import Decimal from 'decimal.js';

type TransactionStatusOptions = 'New' | 'In Progress' | 'Done' | 'Cancelled' | 'Deleted';

const TransactionsTable = () => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TransactionStatusOptions[]>([]);

  const { data, isLoading, error } = useQuery(getPaginatedTransactions, {
    skip,
    limit: 10,
    typeFilter,
    statusFilter: statusFilter.length > 0 ? statusFilter : undefined,
  });

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='flex-col flex items-start justify-between p-6 gap-3 w-full bg-gray-100/40 dark:bg-gray-700/50'>
          <span className='text-sm font-medium'>Filters:</span>
          <div className='flex items-center justify-between gap-3 w-full px-2'>
            <div className='relative flex items-center gap-3'>
              <label htmlFor='type-filter' className='block text-sm text-gray-700 dark:text-white'>
                Transaction Type:
              </label>
              <input
                type='text'
                id='type-filter'
                placeholder='Type'
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.currentTarget.value)}
                className='rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
              <label htmlFor='status-filter' className='block text-sm ml-2 text-gray-700 dark:text-white'>
                Status:
              </label>
              <select
                onChange={(e) => {
                  const status = e.target.value as TransactionStatusOptions;
                  setStatusFilter((prev) =>
                    prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                  );
                }}
                multiple={true}
                className='multi-select'
                id='status-filter'
              >
                <option value='New'>New</option>
                <option value='In Progress'>In Progress</option>
                <option value='Done'>Done</option>
                <option value='Cancelled'>Cancelled</option>
                <option value='Deleted'>Deleted</option>
              </select>
            </div>
            <button
              onClick={() => setPage(1)} // Resets pagination and applies filters
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Apply Filters
            </button>
          </div>
        </div>
        <table className='min-w-full leading-normal'>
          <thead>
            <tr>
              <th>Type</th>
              <th>Fiat Currency</th>
              <th>Crypto Currency</th>
              <th>Fiat Amount</th>
              <th>Crypto Amount</th>
              <th>Exchange Rate</th>
              <th>Commission</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {data?.transactions.map((transaction) => (
          <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.fiatCurrency}</td>
              <td>{transaction.cryptoCurrency}</td>
              <td>{new Decimal(transaction.amountFiat).toFixed(2)}</td>
              <td>{new Decimal(transaction.amountCrypto).toFixed(4)}</td>
              <td>{new Decimal(transaction.exchangeRate).toFixed(4)}</td>
              <td>{new Decimal(transaction.commission).toFixed(2)}</td>
              <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
          <td>{transaction.status}</td>
        </tr>
          ))}

          </tbody>
        </table>
        <div className='pagination'>
          <button onClick={() => setPage(old => Math.max(1, old - 1))} disabled={page === 1}>Previous</button>
          <span>Page {page}</span>
          <button onClick={() => setPage(old => old + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
