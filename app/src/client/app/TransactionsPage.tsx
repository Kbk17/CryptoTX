import Breadcrumb from '../admin/components/Breadcrumb';
import TransactionsTable from '../components/TransactionsTable';
import DefaultLayout from '../admin/layout/DefaultLayout';

export default function TransactionsPage() {
  return (
      <div className="flex flex-col gap-10">
        <TransactionsTable />
      </div>
  );
};