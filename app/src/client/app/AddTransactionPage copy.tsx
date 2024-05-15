import React, { useState, useEffect } from 'react';
import { createTransaction, useQuery, getFiatCurrencyIdByCode, getBankDetailsByCurrency } from 'wasp/client/operations';

interface IBankDetail {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankAddress: string;
  iban: string;
  swift: string;
}

export default function AddTransactionPage() {
  const [transaction, setTransaction] = useState({
    fiatCurrency: 'USD', // Default to USD
    cryptoCurrency: 'USDT', // Default and locked to USDT
    amountFiat: '',
    bankDetailsId: '',
    fiatCurrencyId: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [displayBankDetails, setDisplayBankDetails] = useState<IBankDetail | null>(null);

  const { data: bankDetails } = useQuery(getBankDetailsByCurrency, transaction.fiatCurrency);
  const { data: fiatCurrencyId } = useQuery(getFiatCurrencyIdByCode, transaction.fiatCurrency);

  useEffect(() => {
    if (fiatCurrencyId) {
      setTransaction(prev => ({ ...prev, fiatCurrencyId }));
    }
  }, [fiatCurrencyId]);

  useEffect(() => {
    if (bankDetails && bankDetails.length > 0) {
      // Preload the first bank detail for display and selection
      setTransaction(prev => ({ ...prev, bankDetailsId: bankDetails[0].id }));
      setDisplayBankDetails(bankDetails[0]);
    }
  }, [bankDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
    if (name === "bankDetailsId") {
      const selectedBankDetail = bankDetails.find(bd => bd.id.toString() === value);
      setDisplayBankDetails(selectedBankDetail || null);
    }
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
      fiatAmount
    };

    try {
      await createTransaction({ data: transactionData });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div className="flex justify-between max-w-7xl mx-auto p-5">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-5">Add Transaction</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fiatCurrency">
              Fiat Currency:
            </label>
            <select id="fiatCurrency" name="fiatCurrency" value={transaction.fiatCurrency} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="PLN">PLN</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cryptoCurrency">
              Crypto Currency:
            </label>
            <input id="cryptoCurrency" type="text" name="cryptoCurrency" value={transaction.cryptoCurrency} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankDetailsId">
              Bank Details:
            </label>
            <select name="bankDetailsId" value={transaction.bankDetailsId} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {bankDetails?.map(detail => (
                <option key={detail.id} value={detail.id}>{detail.bankName} - {detail.accountNumber}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountFiat">
              Fiat Amount:
            </label>
            <input id="amountFiat" type="number" name="amountFiat" value={transaction.amountFiat} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
      </div>
      {submitted && displayBankDetails && (
        <div className="flex-1 ml-10">
          <h2 className="text-xl font-bold mb-4">Bank Details</h2>
          <ul>
            <li><strong>Bank Name:</strong> {displayBankDetails.bankName}</li>
            <li><strong>Account Name:</strong> {displayBankDetails.accountName}</li>
            <li><strong>Account Number:</strong> {displayBankDetails.accountNumber}</li>
            <li><strong>Bank Address:</strong> {displayBankDetails.bankAddress}</li>
            <li><strong>IBAN:</strong> {displayBankDetails.iban}</li>
            <li><strong>SWIFT:</strong> {displayBankDetails.swift}</li>
          </ul>
        </div>
      )}
    </div>
  );
}