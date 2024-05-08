import React, { useState, useEffect } from 'react';
import { createTransaction, useQuery, getFiatCurrencyIdByCode, getBankDetailsByCurrency } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';

export default function AddTransactionPage() {
  const navigate = useHistory();
  const [transaction, setTransaction] = useState({
    fiatCurrencyId: '',
    fiatCurrency: '',
    cryptoCurrency: '',
    amountFiat: '',
    walletAddress: '0x54548454564', // Default wallet address
    cryptoCurrencyAmount: null,
    commission: null,
    rate: null,
  });
  const [selectedBankDetailsId, setSelectedBankDetailsId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: bankDetails, isLoading: isBankDetailsLoading } = useQuery(
    getBankDetailsByCurrency, 
    transaction.fiatCurrency, 
    { enabled: !!transaction.fiatCurrency }
  );

  const { data: fiatCurrencyId, isLoading: isFiatCurrencyIdLoading } = useQuery(
    getFiatCurrencyIdByCode, 
    transaction.fiatCurrency, 
    { enabled: !!transaction.fiatCurrency }
  );

  useEffect(() => {
    if (fiatCurrencyId) {
      setTransaction(prevState => ({ ...prevState, fiatCurrencyId }));
    }
  }, [fiatCurrencyId]);

  useEffect(() => {
    setSelectedBankDetailsId(bankDetails?.[0]?.id || '');
  }, [bankDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({ ...prevState, [name]: value }));
  };

  const handleBankDetailsChange = (e) => {
    setSelectedBankDetailsId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transaction.fiatCurrencyId || !transaction.cryptoCurrency || parseFloat(transaction.amountFiat) <= 0 || !selectedBankDetailsId) {
      console.error('Validation failed: fields are missing or values are incorrect, or bank details not selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTransaction({
        data: transaction
      });
      console.log('Transaction successful:', response);
      navigate.push('/transactions');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = transaction.fiatCurrency && transaction.cryptoCurrency && parseFloat(transaction.amountFiat) > 0 && selectedBankDetailsId;

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-semibold text-center mb-6'>Add Transaction</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Input for selecting fiat currency */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="fiatCurrency" className="block text-sm font-medium text-gray-700">
                  Fiat Currency
                </label>
                <select
                  id="fiatCurrency"
                  name="fiatCurrency"
                  value={transaction.fiatCurrency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Currency</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="PLN">PLN</option>
                </select>
              </div>

              {/* Dropdown for selecting bank details */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700">
                  Bank Details
                </label>
                <select
                  id="bankDetails"
                  name="bankDetailsId"
                  value={selectedBankDetailsId}
                  onChange={handleBankDetailsChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {bankDetails?.map((detail) => (
                    <option key={detail.id} value={detail.id}>
                      {detail.bankName} - {detail.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input for selecting cryptocurrency */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="cryptoCurrency" className="block text-sm font-medium text-gray-700">
                  Crypto Currency
                </label>
                <input
                  type="text"
                  id="cryptoCurrency"
                  name="cryptoCurrency"
                  value={transaction.cryptoCurrency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Input for entering fiat amount */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="amountFiat" className="block text-sm font-medium text-gray-700">
                  Fiat Amount
                </label>
                <input
                  type="number"
                  id="amountFiat"
                  name="amountFiat"
                  value={transaction.amountFiat}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className='py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {isSubmitting ? 'Processing...' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
