/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';

export function HtslLogo() {
  return (
    <Link href={'/'} className="flex items-center justify-center gap-2">
      <img className="h-11" src="/htsl-logo.png" alt="Site logo" />
      <div className="flex flex-col gap-0">
        <span>Highlights</span>
        <span>Barcelona</span>
      </div>
    </Link>
  );
}
