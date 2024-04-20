/* import { fetchFilteredCustomers } from '@/app/lib/data';
 *//* import CustomersTable from '@/app/ui/customers/table';
 */ import { Metadata } from 'next';

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

  /*   const customers = await fetchFilteredCustomers(query);
   */
  return (
    <main>
      <h1
        className={`mb-4 w-min whitespace-nowrap border-4 p-2 text-xl md:text-2xl`}
      >
        Users
      </h1>
      {/*       <CustomersTable customers={customers} />
       */}{' '}
    </main>
  );
}
