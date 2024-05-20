import React, { useState, useEffect } from 'react';
import { createTransaction, useQuery, getFiatCurrencyIdByCode, getBankDetailsByCurrency } from 'wasp/client/operations';

const AddTransactionForm = ({ context, onSubmit }) => {
  const [transaction, setTransaction] = useState({
    fiatCurrency: 'USD', // Default to USD
    cryptoCurrency: 'USDT', // Default and locked to USDT
    amountFiat: '',
    bankDetailsId: '',
    fiatCurrencyId: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: bankDetails } = useQuery(getBankDetailsByCurrency, transaction.fiatCurrency);
  const { data: fiatCurrencyId } = useQuery(getFiatCurrencyIdByCode, transaction.fiatCurrency);

  useEffect(() => {
    if (fiatCurrencyId) {
      setTransaction(prev => ({ ...prev, fiatCurrencyId }));
    }
  }, [fiatCurrencyId]);

  useEffect(() => {
    if (bankDetails && bankDetails.length > 0) {
      setTransaction(prev => ({ ...prev, bankDetailsId: bankDetails[0].id }));
    }
  }, [bankDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fiatAmount = parseFloat(transaction.amountFiat);
    if (!transaction.fiatCurrencyId || !transaction.cryptoCurrency || isNaN(fiatAmount) || fiatAmount <= 0 || !transaction.bankDetailsId) {
      console.error('Validation failed: Missing or invalid data.');
      return;
    }

    const transactionData = {
      ...transaction,
      fiatAmount,
      walletAddress: '0x54548454564', // Fixed wallet address
    };

    try {
      const createdTransaction = await createTransaction({ data: transactionData });
      onSubmit({ ...createdTransaction, bankDetails: bankDetails.find(detail => detail.id === createdTransaction.bankDetailsId) });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
      <div className="mb-4">
        <label className="block text-bodydark font-bold mb-2" htmlFor="fiatCurrency">
          Fiat Currency:
        </label>
        <select id="fiatCurrency" name="fiatCurrency" value={transaction.fiatCurrency} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-meta-2">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="PLN">PLN</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-bodydark font-bold mb-2" htmlFor="amountFiat">
          Fiat Amount:
        </label>
        <input id="amountFiat" type="number" name="amountFiat" value={transaction.amountFiat} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-meta-2" />
      </div>
      <div className="mb-4">
        <label className="block text-bodydark font-bold mb-2" htmlFor="bankDetailsId">
          Bank Details:
        </label>
        <select name="bankDetailsId" value={transaction.bankDetailsId} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-meta-2">
          {bankDetails?.map(detail => (
            <option key={detail.id} value={detail.id}>{detail.bankName} - {detail.accountNumber}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-bodydark font-bold mb-2" htmlFor="cryptoCurrency">
          Crypto Currency:
        </label>
        <input id="cryptoCurrency" type="text" name="cryptoCurrency" value={transaction.cryptoCurrency} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-meta-2" />
      </div>
      <div className="mb-6">
        <label className="block text-bodydark font-bold mb-2" htmlFor="walletAddress">
          Wallet Address:
        </label>
        <input id="walletAddress" type="text" name="walletAddress" value="0x54548454564" readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-meta-2 text-xs" />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" disabled={submitted} className={`bg-primary hover:bg-primary-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Submit
        </button>
        {submitted && (
          <p className="text-green-500 ml-4">Transaction successfully added. Please proceed with the payment.</p>
        )}
      </div>
    </form>
  );
};

export default AddTransactionForm;