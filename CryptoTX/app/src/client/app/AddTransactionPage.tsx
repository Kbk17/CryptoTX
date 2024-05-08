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
  // Założenie, że fiatCurrencyId już zawiera tylko ID jako wartość, nie obiekt.
  if (fiatCurrencyId) {
    setTransaction(prev => ({ ...prev, fiatCurrencyId: fiatCurrencyId }));
  }
  if (bankDetails && bankDetails.length > 0) {
    setTransaction(prev => ({ ...prev, bankDetailsId: bankDetails[0].id }));
  }
}, [fiatCurrencyId, bankDetails]);


const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === "amountFiat") {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setTransaction(prev => ({ ...prev, [name]: parsedValue }));
    } else {
      console.log("Invalid input for fiat amount"); // Możesz również ustawić jakiś błąd w stanie
    }
  } else {
    setTransaction(prev => ({ ...prev, [name]: value }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Parsowanie wartości Fiat Amount do liczby
  const fiatAmount = parseFloat(transaction.amountFiat);

  // Walidacja wartości przed próbą stworzenia transakcji
  if (!transaction.fiatCurrencyId) {
    console.error('Validation failed: Fiat currency ID is missing.');
    return;
  }

  if (!transaction.cryptoCurrency) {
    console.error('Validation failed: Crypto currency is missing.');
    return;
  }

  if (isNaN(fiatAmount) || fiatAmount <= 0) {
    console.error('Validation failed: Fiat amount is invalid or not positive.');
    return;
  }

  if (!transaction.bankDetailsId) {
    console.error('Validation failed: Bank details ID is missing.');
    return;
  }

  // Przygotowanie danych do wysłania
  const transactionData = {
    ...transaction,
    fiatAmount, // Używanie sparsowanej wartości
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
