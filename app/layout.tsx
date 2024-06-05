import './global.css';
import { Metadata } from 'next';
import { NextUIProvider } from '@nextui-org/react';

export const metadata: Metadata = {
  title: {
    template: '%s | Highlights Barcelona Dashboard',
    default: 'Highlights Barcelona Dashboard',
  },
  description: 'Highlights Barcelona Dashboard',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
