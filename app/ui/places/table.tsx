import { fetchFilteredPlaces } from '@/app/lib/data';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CarouselFullsize from '../carousel-fullsize';

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

  const places = await fetchFilteredPlaces(query, currentPage);

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
                <th scope="col" className="px-3 py-5 font-medium">
                  Description ES
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description EN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trick ES
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trick EN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Booking ES
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Booking EN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Active
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
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
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
                    {place.official_url}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {truncateText(place.description_es, 40)}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {truncateText(place.description_en, 40)}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.trick_es}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.trick_en}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.booking_es}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.booking_en}
                  </td>
                  <td className="px-3 py-3 text-left align-top">
                    {place.active}
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
