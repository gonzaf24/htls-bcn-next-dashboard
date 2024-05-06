import {
  fetchCategoriesData,
  fetchPlace,
  fetchSubcategoriesData,
  getSubcategoriesByCategoryId,
} from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/places/edit-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Place',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const place = (await fetchPlace(parseInt(id))) as any;
  const categories = await fetchCategoriesData();
  const subcategories = await fetchSubcategoriesData();

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
      <Form
        place={place}
        categories={categories}
        subcategories={subcategories}
      />
    </main>
  );
}
