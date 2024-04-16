import { useQuery, getTransactionsByUser } from 'wasp/client/operations';
import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: string;
  fiatCurrency: string;
  cryptoCurrency: string;
  amountFiat: number;
  exchangeRate: number;
  amountCrypto: number;
  commission: number;
  createdAt: string;
  status: string;
}

interface TransactionsTableProps {
  filter: string;  // This could be expanded to specific filters like transactionId, startDate, endDate.
  sort: string;
  order: string;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ filter, sort, order }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(getTransactionsByUser, {
    userId: 'currentUserId',  // This should be dynamically set based on logged-in user's ID
    transactionId: filter,    // Assuming filter is transactionId, adjust as necessary
    startDate: undefined,     // Set these as necessary or adjust UI to provide inputs
    endDate: undefined,
    orderBy: sort,
    orderDirection: order,
  });

  useEffect(() => {
    // Handle pagination logic here if necessary
  }, [page, filter, sort, order]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;
  if (!data || data.transactions.length === 0) return <div>No transactions found</div>;

  return (
    <div className='flex flex-col gap-4'>
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
          {data.transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.fiatCurrency}</td>
              <td>{transaction.cryptoCurrency}</td>
              <td>{transaction.amountFiat}</td>
              <td>{transaction.amountCrypto}</td>
              <td>{transaction.exchangeRate}</td>
              <td>{transaction.commission}</td>
              <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => setPage(page => Math.max(page - 1, 1))} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page => (!data || data.transactions.length < 10 ? page : page + 1))}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
