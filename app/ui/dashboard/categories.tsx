import { fetchCategoriesData, fetchSubcategoriesData } from '@/app/lib/data';
import CategoriesTable from '../category/table';
import SubcategoriesTable from '../subcategory/table';

export default async function CategoriesWrapper() {
  const categories = await fetchCategoriesData();
  const subcategories = await fetchSubcategoriesData();

  return (
    <div className="mt-10 flex w-full flex-col gap-10">
      <CategoriesTable categories={categories} />
      <SubcategoriesTable
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
