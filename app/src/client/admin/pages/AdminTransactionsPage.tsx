import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import AdminTransactionsTable from '../components/AdminTransactionsTable';
import DefaultLayout from '../layout/DefaultLayout';

const AdminTransactionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Admin Transactions" />
      <div className="flex flex-col gap-10">
        <AdminTransactionsTable />
      </div>
    </DefaultLayout>
  );
};

export default AdminTransactionsPage;