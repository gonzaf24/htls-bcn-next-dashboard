import { fetchDashboardUsers } from '@/app/lib/data';
import Link from 'next/link';

export default async function DashboardUsersTable() {
  const dashboardUsers = await fetchDashboardUsers();

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      actions
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      email
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      role
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      id
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {dashboardUsers.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="flex gap-3 whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <Link
                          href={`/dashboard/user/${user.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <p>{user.name}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <p>{user.email}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <p>{user.role}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <p>{user.id}</p>
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
