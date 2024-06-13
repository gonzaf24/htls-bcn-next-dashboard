import { fetchEvent } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/events/edit-form';
import { Metadata } from 'next';
import { EventsTable } from '@/app/lib/definitions';
import { formatDateHourseMinutesToLocal, formatDateToLocal, formatDatesss } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'Edit Event',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const event = (await fetchEvent(id)) as EventsTable;

  /* console.log('dateStart', event.dateStart);
  console.log('dateEnd', event.dateEnd);
  console.log("prueba S " , formatDatesss(event.dateStart));
  console.log("prueba E " , formatDatesss(event.dateEnd)); */
  /* console.log('after format dateStart', formatDateToLocal(event.dateStart));
  console.log('after format dateEnd', formatDateToLocal(event.dateEnd));
  console.log('after format ', formatDateHourseMinutesToLocal(event.dateStart));
  console.log('after format ', formatDateHourseMinutesToLocal(event.dateEnd)); */

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Events', href: '/dashboard/events' },
          {
            label: 'Edit Event',
            href: `/dashboard/events/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form event={event} />
    </main>
  );
}
