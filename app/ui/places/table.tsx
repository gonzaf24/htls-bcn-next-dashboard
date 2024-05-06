import { fetchFilteredPlaces } from '@/app/lib/data';
import Link from 'next/link';
import CarouselFullsize from '../carousel-fullsize';
import { DeletePlace } from './delete-form';
import { PlacesTable as PlacesTableDef } from '@/app/lib/definitions';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function PlacesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const places = (await fetchFilteredPlaces(
    query,
    currentPage,
  )) as PlacesTableDef[];
  return (
    <div className="mt-6 flow-root overflow-x-scroll">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Actions
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Active
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  ID
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Photos
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  City
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Instagram
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Official URL
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-5 font-medium"
                >
                  Description ES
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-5 font-medium"
                >
                  Description EN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trick ES
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trick EN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {places?.map((place) => (
                <tr
                  key={place.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="flex gap-3 whitespace-nowrap bg-white px-4 py-3 text-left align-top text-sm">
                    <Link
                      href={`/dashboard/places/${place.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <DeletePlace id={place.id} />
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={place.active}
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.categoryName.concat(' - ', place.subcategoryName)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-left align-top">
                    {place.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-left align-top">
                    {place.name}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    <CarouselFullsize photos={place.photos} />
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.address}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.city}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.instagram}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.officialUrl}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {truncateText(place.descriptionEs, 40)}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {truncateText(place.descriptionEn, 40)}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.trickEs}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.trickEn}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {formatDateToLocal(place.lastUpdate?.toString() || '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
