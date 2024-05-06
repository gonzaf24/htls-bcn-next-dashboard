import { fetchUsersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import DashboardUsersTable from '@/app/ui/users/dash-users-table';
import HtlsUsersTable from '@/app/ui/users/htls-users-table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchUsersPages(query);

  /*   const customers = await fetchFilteredCustomers(query);
   */
  return (
    <main>
      <h1
        className={`mb-4 w-min whitespace-nowrap border-4 p-2 text-xl md:text-2xl`}
      >
        Users
      </h1>
      <div className="flex w-full items-center justify-between">
        <h1 className={`mb-0 text-xl md:text-2xl`}>
          Dashboard users</h1>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <DashboardUsersTable />
      </div>

      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className={`mb-0 text-xl md:text-2xl`}>
          Highlights users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search htls users..." />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <HtlsUsersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
