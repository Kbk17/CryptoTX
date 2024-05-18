import React, { useState, useEffect, useRef } from 'react';
import { createTransaction, useQuery, getFiatCurrencyIdByCode, getBankDetailsByCurrency } from 'wasp/client/operations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

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
    fiatCurrencyId: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [displayBankDetails, setDisplayBankDetails] = useState<IBankDetail | null>(null);
  const bankDetailsRef = useRef<HTMLDivElement>(null);

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
      setDisplayBankDetails(bankDetails[0]);
    }
  }, [bankDetails]);

  useEffect(() => {
    if (submitted && displayBankDetails && bankDetailsRef.current) {
      bankDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitted, displayBankDetails]);

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
      fiatAmount,
      walletAddress: '0x54548454564', // Fixed wallet address
    };

    try {
      await createTransaction({ data: transactionData });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }, (err) => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start mx-auto px-4 py-5 space-y-10 lg:space-y-0 lg:space-x-10">
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-card p-8 flex flex-col">
        <h1 className="text-title-lg font-satoshi text-primary mb-6">Add Transaction</h1>
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
              <p className="text-success ml-4">Transaction Created, please make payment to finalize transaction.</p>
            )}
          </div>
        </form>
      </div>
      {submitted && displayBankDetails && (
        <div ref={bankDetailsRef} className="w-full lg:w-1/2 bg-white rounded-lg shadow-card p-8 flex flex-col">
          <h2 className="text-title-md font-satoshi text-primary mb-4">Bank Details</h2>
          <ul className="space-y-2 flex-grow">
            {Object.entries(displayBankDetails).map(([key, value]) => (
              <li key={key} className="flex justify-between items-center py-2">
                <span className="font-bold capitalize text-bodydark">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="flex items-center text-body">
                  {value}
                  <FontAwesomeIcon icon={faClipboard} className="w-5 h-5 ml-2 cursor-pointer text-primary" onClick={() => copyToClipboard(value)} />
                </span>
              </li>
            ))}
          </ul>
          <p className="text-danger mt-4">Transactions not settled within 14 business days will be cancelled. Please transfer only from your own account. Ensure all details match your bank account information to avoid delays.</p>
        </div>
      )}
    </div>
  );
}
