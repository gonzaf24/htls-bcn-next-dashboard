'use client';
import { fetchCategories, getSubcategoriesMaxId } from '@/app/lib/actions';
import { FormattedCategoriesTable } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/subcategory/create-form';
import { useEffect, useState } from 'react';

export default function Page() {
  const [categories, setCategories] = useState<FormattedCategoriesTable[]>([]);
  const [subcategoryId, setSubcategoryId] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const categories = await fetchCategories();
      setCategories(categories);
    }
    fetchData();
  }, []);

  const onCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = parseInt(event.target.value);
    const _subcategoryId = await getSubcategoriesMaxId(categoryId);
    setSubcategoryId(_subcategoryId + 1);
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cat-Subcat', href: '/dashboard' },
          {
            label: 'Create Subcategory',
            href: '/dashboard/subcategory/create',
            active: true,
          },
        ]}
      />
      <Form
        categories={categories}
        changeCategory={onCategoryChange}
        subcategoryId={subcategoryId}
      />
    </main>
  );
}
