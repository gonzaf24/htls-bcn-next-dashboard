'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createCategory } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({ categoryId }: { categoryId: number }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createCategory, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Category Id */}
        <div className="mb-4">
          <label htmlFor="id" className="mb-2 block text-sm font-medium">
            Category Id
          </label>
          <div className="relative mt-2 rounded-md">
              <input
                id="id"
                name="id"
                type="number"
                step="0.01"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="id-error"
                defaultValue={categoryId}
              />
          </div>

          <div id="id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.id &&
              state.errors.id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        
        {/* Category Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Category name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="string"
                step="0.01"
                placeholder="Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Category translation name */}
        <div className="mb-4">
          <label htmlFor="t_name" className="mb-2 block text-sm font-medium">
            Category translation name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="t_name"
                name="t_name"
                type="string"
                step="0.01"
                placeholder="Translation name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="t_name-error"
              />
            </div>
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.t_name &&
              state.errors.t_name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

         {/* Category icon */}
         <div className="mb-4">
          <label htmlFor="icon" className="mb-2 block text-sm font-medium">
            Category icon name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="icon"
                name="icon"
                type="string"
                step="0.01"
                placeholder="Icon name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="icon-error"
              />
            </div>
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.icon &&
              state.errors.icon.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Category</Button>
      </div>
    </form>
  );
}
