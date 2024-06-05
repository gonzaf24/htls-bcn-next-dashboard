import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/events/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Event',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Events', href: '/dashboard/events' },
          {
            label: 'Create Event',
            href: '/dashboard/events/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
