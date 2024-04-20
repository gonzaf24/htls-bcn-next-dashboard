import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import CategoriesWrapper from '@/app/ui/dashboard/categories';

export default async function Page() {
  return (
    <main>
      <h1
        className={`mb-4 w-min whitespace-nowrap border-4 p-2 text-xl md:text-2xl`}
      >
        Categories / Subcategories
      </h1>
      <div className="">
        <Suspense fallback={<CardsSkeleton />}>
          <CategoriesWrapper />
        </Suspense>
      </div>
    </main>
  );
}
