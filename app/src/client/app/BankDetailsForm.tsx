import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

type BankDetailsFormProps = {
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    bankAddress: string;
    iban: string;
    swift: string;
  } | null;
  paymentId: string;
  userId: number;
};

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ bankDetails, paymentId, userId }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }, (err) => {
      console.error('Failed to copy:', err);
    });
  };

  if (!bankDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col h-full">
      <h2 className="text-title-md font-satoshi text-primary mb-4">Bank Details</h2>
      <p className="text-body mb-4" style={{ color: '#cc6666' }}>
        Payments must be sent exclusively from your own account, ensuring all account details match those verified by the system to prevent delays.
      </p>
      <ul className="space-y-2 flex-grow">
        {Object.entries(bankDetails).map(([key, value]) => (
          <li key={key} className="flex justify-between items-center py-2">
            <span className="font-bold capitalize text-bodydark">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="flex items-center text-body">
              {String(value)}
              <FontAwesomeIcon icon={faClipboard} className="w-5 h-5 ml-2 cursor-pointer text-primary" onClick={() => copyToClipboard(String(value))} />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center py-2">
        <label htmlFor="paymentDescription" className="font-bold capitalize text-bodydark">Payment ID:</label>
        <span className="flex items-center text-body">
          <strong>{paymentId}</strong>
          <FontAwesomeIcon icon={faClipboard} className="w-5 h-5 ml-2 cursor-pointer text-primary" onClick={() => copyToClipboard(paymentId)} />
        </span>
      </div>
      <div className="mt-4">
        <p className="text-body">
          Deposits will be returned and additional fees applied if payments are made from unverified third parties. Payments with incorrect stated purposes, amounts exceeding 14,500 EUR without source confirmation within 2 working days, or incorrect recipient details will also face these issues.
        </p>
      </div>
    </div>
  );
};

export default BankDetailsForm;