import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
import { getCategoriesMaxId } from '@/app/lib/data';
import Form from '@/app/ui/category/create-form';

export const metadata: Metadata = {
  title: 'Create Category',
};

export default async function Page() {
  const id = await getCategoriesMaxId();
  const categoryId = id + 1;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cat-Subcat', href: '/dashboard' },
          {
            label: 'Create Category',
            href: '/dashboard/category/create',
            active: true,
          },
        ]}
      />
      <Form categoryId={categoryId} />
    </main>
  );
}
