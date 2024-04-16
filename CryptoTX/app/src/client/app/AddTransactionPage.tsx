import React, { useState } from 'react';
import { createTransaction } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';

export default function AddTransactionPage() {
  const navigate = useHistory();

  const [transaction, setTransaction] = useState({
    type: '',
    fiatCurrency: '',
    cryptoCurrency: '',
    amountFiat: '',
    exchangeRate: '',
    commission: '',
    amountCrypto: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transaction.type || !transaction.fiatCurrency || !transaction.cryptoCurrency ||
        parseFloat(transaction.amountFiat) <= 0 || parseFloat(transaction.exchangeRate) <= 0 || parseFloat(transaction.commission) <= 0 ||
        parseFloat(transaction.amountCrypto) <= 0) {
      console.error('Validation failed: fields are missing or values are incorrect.');
      return;
    }

    try {
      const response = await createTransaction({ data: { ...transaction, status: 'Pending' } });
      console.log(response);
      navigate.push('/transactions');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-semibold text-center mb-6'>Add Transaction</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Type</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="type" name="type" value={transaction.type} onChange={handleInputChange}>
                  <option value="">Select Type</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fiatCurrency">Fiat Currency</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fiatCurrency" name="fiatCurrency" value={transaction.fiatCurrency} onChange={handleInputChange}>
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="PLN">PLN</option>
                  <option value="EUR">EUR</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cryptoCurrency">Crypto Currency</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="cryptoCurrency" name="cryptoCurrency" value={transaction.cryptoCurrency} onChange={handleInputChange}>
                  <option value="">Select Crypto</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountFiat">Fiat Amount</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amountFiat" name="amountFiat" value={transaction.amountFiat} onChange={handleInputChange}/>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exchangeRate">Exchange Rate</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exchangeRate" name="exchangeRate" value={transaction.exchangeRate} onChange={handleInputChange}/>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountCrypto">Crypto Amount</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amountCrypto" name="amountCrypto" value={transaction.amountCrypto} onChange={handleInputChange}/>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commission">Commission</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="commission" name="commission" value={transaction.commission} onChange={handleInputChange}/>
              </div>
              <div className='inline-flex w-full justify-end mt-6'>
                <button
                  type="submit"
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
