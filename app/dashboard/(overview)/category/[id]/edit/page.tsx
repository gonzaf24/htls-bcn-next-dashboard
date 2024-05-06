import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchCategoryById } from '@/app/lib/data';
import Form from '@/app/ui/category/edit-form';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const category = await fetchCategoryById(parseInt(id));

  if (!category) {
    notFound();
  }

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
      <Form category={category} />
    </main>
  );
}
