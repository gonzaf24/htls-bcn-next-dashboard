import { FormattedCategoriesTable } from '@/app/lib/definitions';
import Link from 'next/link';
import { DeleteCategory } from './delete-form';

export default async function CategoriesTable({
  categories,
}: {
  categories: FormattedCategoriesTable[];
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`mb-0 text-xl md:text-2xl`}>Categories</h1>
        <Link
          href="/dashboard/category/create"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      id
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      t_name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      icon
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {categories.map((category) => (
                    <tr key={category.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <p>{category.id}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {category.t_name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {category.icon}
                      </td>
                      <td className="flex gap-3 whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <Link
                          href={`/dashboard/category/${category.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <DeleteCategory id={category.id} />
                        {/* <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
