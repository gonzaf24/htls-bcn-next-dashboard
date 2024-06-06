/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateEvent } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { EventsTable } from '@/app/lib/definitions';
import TagsForm from './tagsForm';

export default function Form({ event }: { event: EventsTable }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateEvent, initialState);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(
    event?.photos || [],
  );
  const [photosError, setPhotosError] = useState<string>();
  const [selectedTags, setSelectedTags] = useState<string[]>(event?.tags || []);

  useEffect(() => {
    setSelectedTags(event.tags);
  }, [event.tags]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      for (const photo of uploadedPhotos) {
        formData.append('photos', photo);
      }
      const filteredTags = selectedTags.filter((tag) => tag.trim() !== '');
      formData.append('tags', filteredTags.join(','));
      dispatch(formData);
    } catch (error) {
      console.log('Create dispatch error: ', error);
    }
  }

  async function uploadPhotos() {
    setPhotosError('');
    const form = document.getElementById(
      'update-event-form',
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
              `/api/photos?fileName=${imageFile.name}&folderName=places`,
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

  const formatDateTime = (dateString = '') => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const dateStart = event.dateStart ? formatDateTime(event.dateStart) : '';
  const dateEnd = event.dateEnd ? formatDateTime(event.dateEnd) : '';

  return (
    <form onSubmit={handleSubmit} id="update-event-form">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Event Id */}
        <div className="mb-4">
          <label
            htmlFor="id"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Event Id
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="id"
              name="id"
              type="text"
              step="0.01"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="id-error"
              defaultValue={event.id}
              readOnly
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
        {/* Date start */}
        <div className="mb-4">
          <label
            htmlFor="date_start"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Date Start
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="date_start"
              name="date_start"
              type="datetime-local"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="date_start-error"
              defaultValue={dateStart}
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
        {/* Date end */}
        <div className="mb-4">
          <label
            htmlFor="date_end"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Date End
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="date_end"
              name="date_end"
              type="datetime-local"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="date_end-error"
              defaultValue={dateEnd}
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
        <div className="mb-4">
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
              defaultValue={event.title}
            />
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Description es */}
        <div className="mb-4">
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
              defaultValue={event.descriptionEs}
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
        <div className="mb-4">
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
              defaultValue={event.descriptionEn}
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
        {/* Its free */}
        <div className="mb-4">
          <label
            htmlFor="free"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Free
          </label>
          <div className="relative mt-2 w-min rounded-md">
            <input
              id="free"
              name="free"
              type="checkbox"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="free-error"
              defaultChecked={event.free}
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
        <div className="mb-4">
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
              step="0.01"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="price-error"
              defaultValue={event.price}
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
        {/* Tickets Link */}
        <div className="mb-4">
          <label
            htmlFor="tickets_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Ticket Link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="tickets_link"
              name="tickets_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="tickets_link-error"
              defaultValue={event.ticketsLink}
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
        <div className="mb-4">
          <label
            htmlFor="instagram_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Instagram Link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="instagram_link"
              name="instagram_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="instagram_link-error"
              defaultValue={event.instagramLink}
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
        <div className="mb-4">
          <label
            htmlFor="official_link"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Official Link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="official_link"
              name="official_link"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="official_link-error"
              defaultValue={event.officialLink}
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
        {/* Photos */}
        <div className="mb-4">
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
                <div key={photo} className="flex justify-between gap-4">
                  <p>{photo}</p>
                  <div className="flex gap-4">
                    <img src={photo} alt="uploaded photo" className="w-20" />
                    <button
                      type="button"
                      onClick={() => deletePhoto(photo)}
                      className="rounded-md border p-2 text-red-500 hover:bg-red-300 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {photosError && (
            <p className="mt-2 text-sm text-red-500">{photosError}</p>
          )}
        </div>
        {/* contact name */}
        <div className="mb-4">
          <label
            htmlFor="contact_name"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_name-error"
              defaultValue={event.contactName}
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
        {/* contact email */}
        <div className="mb-4">
          <label
            htmlFor="contact_email"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact Email
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_email-error"
              defaultValue={event.contactEmail}
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
        {/* contact phone */}
        <div className="mb-4">
          <label
            htmlFor="contact_phone"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Contact Phone
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="contact_phone"
              name="contact_phone"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact_phone-error"
              defaultValue={event.contactPhone}
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
        {/* tags */}
        <div className="mb-4">
          <TagsForm setSelectedTags={setSelectedTags} tags={event.tags} />
        </div>
        {/* Active */}
        <div className="mb-4">
          <label
            htmlFor="active"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Active
          </label>
          <div className="relative mt-2 w-min rounded-md">
            <input
              id="active"
              name="active"
              type="checkbox"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="active-error"
              defaultChecked={event.active}
            />
          </div>
          <div id="active-error" aria-live="polite" aria-atomic="true">
            {state.errors?.active &&
              state.errors.active.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* approved */}
        <div className="mb-4">
          <label
            htmlFor="approved"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Approved
          </label>
          <div className="relative mt-2 w-min rounded-md">
            <input
              id="approved"
              name="approved"
              type="checkbox"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="approved-error"
              defaultChecked={event.approved}
            />
          </div>
          <div id="approved-error" aria-live="polite" aria-atomic="true">
            {state.errors?.approved &&
              state.errors.approved.map((error: string) => (
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
        <Button type="submit">Edit Place</Button>
      </div>
    </form>
  );
}
