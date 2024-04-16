// File path: /src/components/TransactionsPage.tsx

import React, { useState } from 'react';
import TransactionsTable from './TransactionsTable';  // Upewnij się, że ścieżka jest poprawna

const TransactionsPage = () => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  return (
    <div>
      <h1>Transactions</h1>
      <div>
        <input type="text" placeholder="Filter by Type, Currency..." value={filter} onChange={handleFilterChange} />
        <select value={sort} onChange={handleSortChange}>
          <option value="createdAt">Date</option>
          <option value="amountFiat">Fiat Amount</option>
          <option value="amountCrypto">Crypto Amount</option>
        </select>
        <select value={order} onChange={handleOrderChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <TransactionsTable filter={filter} sort={sort} order={order} />
    </div>
  );
};

export default TransactionsPage;
