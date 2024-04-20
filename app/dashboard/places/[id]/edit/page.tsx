import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
/* import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
 */ import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [
    /* invoice, customers */
  ] = await Promise.all([
    /*   fetchInvoiceById(id),
    fetchCustomers(), */
  ]);
  /* 
  if (!invoice) {
    notFound();
  }
 */
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Places', href: '/dashboard/places' },
          {
            label: 'Edit Place',
            href: `/dashboard/places/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}
