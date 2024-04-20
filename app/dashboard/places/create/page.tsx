/* import { fetchCustomers } from '@/app/lib/data';
 */ /* import Form from '@/app/ui/invoices/create-form'; */
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  /*   const customers = await fetchCustomers();
   */
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Places', href: '/dashboard/places' },
          {
            label: 'Create Place',
            href: '/dashboard/places/create',
            active: true,
          },
        ]}
      />
      {/*       <Form customers={customers} />
       */}{' '}
    </main>
  );
}
