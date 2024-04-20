import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [
    /* invoice, customers */
  ] = await Promise.all([
    /*  fetchInvoiceById(id),
    fetchCustomers(), */
  ]);

  /* if (!invoice) {
    notFound();
  } */

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cat-Subcat', href: '/dashboard' },
          {
            label: 'Edit Category',
            href: `/dashboard/category/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}
