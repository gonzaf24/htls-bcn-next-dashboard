import { fetchCategoriesData, fetchSubcategoriesData } from '@/app/lib/data';
import { getPlacesMaxId } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/places/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Place',
};

export default async function Page() {
  const maxPlaceId = await getPlacesMaxId();
  const placeId = maxPlaceId + 1;
  const categories = await fetchCategoriesData();
  const subcategories = await fetchSubcategoriesData();

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
      <Form
        placeId={placeId}
        categories={categories}
        subcategories={subcategories}
      />
    </main>
  );
}
