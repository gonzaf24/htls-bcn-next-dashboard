/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { createEvent } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import TagsForm from '@/app/ui/events/tagsForm';

export default function Form({}: {}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createEvent, initialState);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [photosError, setPhotosError] = useState<string>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      for (const photo of uploadedPhotos) {
        formData.append('photos', photo);
      }
      formData.append('tags', selectedTags.join(','));
      dispatch(formData);
    } catch (error) {
      console.log('Create dispatch error: ', error);
    }
  }

  async function uploadPhotos() {
    setPhotosError('');
    const form = document.getElementById(
      'create-event-form',
    ) as HTMLFormElement | null;
    if (!form) return;
    const formData = new FormData(form);
    const imagesFiles = Array.from(formData?.getAll('images') as FileList | []);
    let hasErrors = false;
    if (imagesFiles.length > 0 && imagesFiles[0].name !== '') {
      for (const imageFile of imagesFiles) {
        if (!hasErrors) {
          try {
            const response = await fetch(
              `/api/photos?fileName=${imageFile.name}&folderName=events`,
              {
                method: 'POST',
                body: imageFile,
              },
            );
            const fileUrl = await response.json();
            if (fileUrl.message) {
              hasErrors = true;
              setPhotosError(fileUrl.message);
              uploadedPhotos.map(async (photo) => {
                await fetch(`/api/photos?fileUrl=${photo}`, {
                  method: 'DELETE',
                });
              });
              return;
            } else {
              setUploadedPhotos((prevstate) => [
                ...prevstate,
                fileUrl.blob.url,
              ]);
            }
          } catch (error) {
            setPhotosError('Error on upload photos');
            console.log('Error on upload photos: ', error);
          }
        }
      }
    }
  }

  async function deletePhoto(photoUrl: string) {
    try {
      setPhotosError('');
      const response = await fetch(`/api/photos?fileUrl=${photoUrl}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setUploadedPhotos((prevstate) => {
        return prevstate.filter((photo) => photo !== photoUrl);
      });
    } catch (error) {
      setPhotosError('Error on delete photo');
    }
  }

  return (
    <form onSubmit={handleSubmit} id="create-event-form">
      <div className="flex w-max flex-col gap-4 rounded-md bg-gray-50 p-4 md:p-6">
        {/* Start date */}
        <div className="">
          <label
            htmlFor="date_start"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Start date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="date_start"
              name="date_start"
              type="datetime-local"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="date_start-error"
            />
          </div>

          <div id="date_start-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date_start &&
              state.errors.date_start.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* End date */}
        <div className="">
          <label
            htmlFor="date_end"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            End date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="date_end"
              name="date_end"
              type="datetime-local"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="date_end-error"
            />
          </div>

          <div id="date_end-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date_end &&
              state.errors.date_end.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Title */}
        <div className="">
          <label
            htmlFor="title"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Title
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="title"
              name="title"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="title-error"
            />
          </div>

          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Description es */}
        <div className="">
          <label
            htmlFor="description_es"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Description ES
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="description_es"
              name="description_es"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description_es-error"
            />
          </div>

          <div id="description_es-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description_es &&
              state.errors.description_es.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Description en */}
        <div className="">
          <label
            htmlFor="description_en"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Description EN
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="description_en"
              name="description_en"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description_en-error"
            />
          </div>

          <div id="description_en-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description_en &&
              state.errors.description_en.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Is free event? */}
        <div className="">
          <label
            htmlFor="free"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Is free event
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="free"
              name="free"
              type="checkbox"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="free-error"
            />
          </div>

          <div id="free-error" aria-live="polite" aria-atomic="true">
            {state.errors?.free &&
              state.errors.free.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Price */}
        <div className="">
          <label
            htmlFor="price"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="price"
              name="price"
              type="number"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="price-error"
            />
          </div>

          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Ticket Link */}
        <div className="">
          <label
            htmlFor="tickets_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Tickets Link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="tickets_link"
              name="tickets_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="tickets_link-error"
            />
          </div>

          <div id="tickets_link-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tickets_link &&
              state.errors.tickets_link.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Instagram Link */}
        <div className="">
          <label
            htmlFor="instagram_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Instagram link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="instagram_link"
              name="instagram_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="instagram_link-error"
            />
          </div>

          <div id="instagram_link-error" aria-live="polite" aria-atomic="true">
            {state.errors?.instagram_link &&
              state.errors.instagram_link.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Official Link */}
        <div className="">
          <label
            htmlFor="official_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Official link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="official_link"
              name="official_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="official_link-error"
            />
          </div>

          <div id="official_link-error" aria-live="polite" aria-atomic="true">
            {state.errors?.official_link &&
              state.errors.official_link.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Location name */}
        <div className="">
          <label
            htmlFor="location_name"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Location name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="location_name"
              name="location_name"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="location_name-error"
            />
          </div>

          <div id="location_name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.location_name &&
              state.errors.location_name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Location address */}
        <div className="">
          <label
            htmlFor="location_address"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Location address
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="location_address"
              name="location_address"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="location_address-error"
            />
          </div>

          <div
            id="location_address-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.location_address &&
              state.errors.location_address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Location googlemaps link */}
        <div className="">
          <label
            htmlFor="location_googlemaps_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Location googlemaps link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="location_googlemaps_link"
              name="location_googlemaps_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="location_googlemaps_link-error"
            />
          </div>

          <div
            id="location_googlemaps_link-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.location_googlemaps_link &&
              state.errors.location_googlemaps_link.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Contact name */}
        <div className="">
          <label
            htmlFor="contact_name"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_name-error"
            />
          </div>

          <div id="contact_name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.contact_name &&
              state.errors.contact_name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Contact email */}
        <div className="">
          <label
            htmlFor="contact_email"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact email
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_email-error"
            />
          </div>

          <div id="contact_email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.contact_email &&
              state.errors.contact_email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Contact phone */}
        <div className="">
          <label
            htmlFor="contact_phone"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact phone
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_phone-error"
            />
          </div>

          <div id="contact_phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.contact_phone &&
              state.errors.contact_phone.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <TagsForm
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
        />
        {/* Photos */}
        <div className="">
          <label
            htmlFor="images"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Photos
          </label>
          <div className="relative mb-4 mt-2 flex w-full justify-between rounded-md">
            <input
              type="file"
              id="images"
              name="images"
              accept=".jpg,.jpeg,.png"
              onChange={() => setPhotosError('')}
              multiple
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={uploadPhotos}
                className="rounded-md border p-2 text-blue-500 hover:bg-blue-300 hover:text-white"
              >
                Upload photos
              </button>

              <button
                type="button"
                onClick={() => {
                  const photosInput = document.getElementById(
                    'images',
                  ) as HTMLInputElement;
                  photosInput.value = '';
                  setPhotosError('');
                }}
                className="rounded-md border p-2 text-blue-500 hover:bg-blue-300 hover:text-white"
              >
                Clear photos
              </button>
            </div>
          </div>
          {/* Uploaded photos list */}
          <div className="mb-4 flex flex-col gap-2">
            {uploadedPhotos &&
              uploadedPhotos.map((photo) => (
                <div key={photo} className="flex gap-4">
                  <p>{photo}</p> {/* print here a small image of the photo */}
                  <img src={photo} alt="uploaded photo" className="w-20" />
                  <button type="button" onClick={() => deletePhoto(photo)}>
                    Delete
                  </button>
                </div>
              ))}
          </div>

          {photosError && (
            <p className="mt-2 text-sm text-red-500">{photosError}</p>
          )}
        </div>
        {/* Priority */}
        <div className="">
          <label
            htmlFor="priority"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Priority
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="priority"
              name="priority"
              type="number"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="priority-error"
            />
          </div>

          <div id="priority-error" aria-live="polite" aria-atomic="true">
            {state.errors?.priority &&
              state.errors.priority.map((error: string) => (
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
          href="/dashboard/events"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
}
