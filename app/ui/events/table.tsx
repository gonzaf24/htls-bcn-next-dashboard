import { fetchFilteredEvents } from '@/app/lib/data';
import Link from 'next/link';
import CarouselFullsize from '../carousel-fullsize';
import { DeleteEvent } from './delete-form';
import {
  formatDateHourseMinutesToLocal,
  formatDateToLocal,
} from '@/app/lib/utils';
import { EventsTable as EventsTableDef } from '@/app/lib/definitions';

export default async function EventsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const events = (await fetchFilteredEvents(
    query,
    currentPage,
  )) as EventsTableDef[];

  console.log(" eventsss ", events);

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
                <th scope="col" className="px-3 py-5 font-medium">
                  Approved
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Tags
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Description es
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Description en
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Start date
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  End date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {events?.map((event) => (
                <tr
                  key={event.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="flex gap-3 whitespace-nowrap bg-white px-4 py-3 text-left align-top text-sm">
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <DeleteEvent id={event.id} />
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {event.active ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {event.approved ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {event?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="mr-1 inline-block rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {truncateText(event.descriptionEs, 100)}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {truncateText(event.descriptionEn, 100)}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {formatDateToLocal(event.dateStart)} -{' '}
                    {formatDateHourseMinutesToLocal(event.dateStart)}
                  </td>
                  <td className="px-4 py-3 text-left align-top text-sm">
                    {formatDateToLocal(event.dateEnd)} -{' '}
                    {formatDateHourseMinutesToLocal(event.dateEnd)}
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
