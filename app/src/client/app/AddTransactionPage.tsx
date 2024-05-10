import React, { useState, useEffect } from 'react';
import { createTransaction, useQuery, getFiatCurrencyIdByCode, getBankDetailsByCurrency } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';

export default function AddTransactionPage() {
  const navigate = useHistory();
  const [transaction, setTransaction] = useState({
    fiatCurrency: '',
    cryptoCurrency: '',
    amountFiat: '',
    bankDetailsId: '',
    fiatCurrencyId: ''
  });

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
    if (name === "amountFiat") {
      setTransaction(prev => ({ ...prev, [name]: value }));
    } else {
      setTransaction(prev => ({ ...prev, [name]: value }));
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
      const response = await createTransaction({ data: transactionData });
      console.log('Transaction successful:', response);
      navigate.push('/transactions');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div>
      <h1>Add Transaction</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Fiat Currency:
          <select name="fiatCurrency" value={transaction.fiatCurrency} onChange={handleInputChange}>
            <option value="">Select Currency</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="PLN">PLN</option>
          </select>
        </label>
        <label>
          Bank Details:
          <select name="bankDetailsId" value={transaction.bankDetailsId} onChange={handleInputChange}>
            {bankDetails?.map(detail => (
              <option key={detail.id} value={detail.id}>{detail.bankName} - {detail.accountNumber}</option>
            ))}
          </select>
        </label>
        <label>
          Crypto Currency:
          <input type="text" name="cryptoCurrency" value={transaction.cryptoCurrency} onChange={handleInputChange} />
        </label>
        <label>
          Fiat Amount:
          <input type="number" name="amountFiat" value={transaction.amountFiat} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
