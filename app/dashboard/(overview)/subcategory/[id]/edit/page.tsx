/* import Form from '@/app/ui/invoices/edit-form';
 */ import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
/* import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
 */ import { notFound } from 'next/navigation';
/* import { Metadata } from 'next'; */
import {
  fetchCategoriesData,
  fetchCategoryById,
  fetchSubcategoriesData,
  fetchSubcategoryById,
} from '@/app/lib/data';
import Form from '@/app/ui/subcategory/edit-form';

/* export const metadata: Metadata = {
  title: 'Edit Subcategory',
};
 */
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const subcategory = await fetchSubcategoryById(parseInt(id));
  const categories = await fetchCategoriesData();

  if (!subcategory) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cat-Subcat', href: '/dashboard' },
          {
            label: 'Edit Subcategory',
            href: `/dashboard/subcategory/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form subcategory={subcategory} categories={categories} />
    </main>
  );
}
