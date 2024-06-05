import {
  fetchEvent
} from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/events/edit-form';
import { Metadata } from 'next';
import { EventsTable } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Edit Event',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const event = await fetchEvent(id) as EventsTable
  
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
      <Form event={event}/>
    </main>
  );
}
