import React, { useState, useRef } from 'react';
import AddTransactionForm from './AddTransactionForm';
import BankDetailsForm from './BankDetailsForm';
import Background from '../components/Background'; // Import Background component

export default function AddTransactionPage({ context }) {
  const [submitted, setSubmitted] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const bankDetailsRef = useRef<HTMLDivElement>(null);

  const handleTransactionSubmit = (data) => {
    setTransactionData(data);
    setSubmitted(true);
    if (bankDetailsRef.current) {
      bankDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Background offset={80}>
      <div className="flex flex-col lg:flex-row justify-center items-start mx-auto px-4 py-5 space-y-10 lg:space-y-0 lg:space-x-10 h-full">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-8 flex flex-col h-full">
            <h1 className="text-title-lg font-satoshi text-primary dark:text-white mb-6">Add Transaction</h1>
            <AddTransactionForm context={context} onSubmit={handleTransactionSubmit} />
          </div>
        </div>
        {submitted && transactionData && (
          <div ref={bankDetailsRef} className="w-full lg:w-1/2 flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-8 flex flex-col h-full">
              <BankDetailsForm
                bankDetails={transactionData.bankDetails || null}
                paymentId={transactionData.paymentId}
                userId={transactionData.userId}
              />
            </div>
          </div>
        )}
      </div>
    </Background>
  );
}
