/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePlace } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {
  FormattedCategoriesTable,
  FormattedSubcategoriesTable,
  PlacesTable,
} from '@/app/lib/definitions';
import { useState } from 'react';

export default function Form({
  categories,
  subcategories,
  place,
}: {
  categories: FormattedCategoriesTable[];
  subcategories: FormattedSubcategoriesTable[];
  place: PlacesTable;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updatePlace, initialState);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    place.categoryId,
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(place.photos);
  const [photosError, setPhotosError] = useState<string>();
  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.category_id === selectedCategoryId,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      for (const photo of uploadedPhotos) {
        formData.append('photos', photo);
      }
      dispatch(formData);
    } catch (error) {
      console.log('Create dispatch error: ', error);
    }
  }

  async function uploadPhotos() {
    setPhotosError('');
    const form = document.getElementById(
      'create-place-form',
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

  return (
    <form onSubmit={handleSubmit} id="create-place-form">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Place Id */}
        <div className="mb-4">
          <label
            htmlFor="id"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Place Id
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="id"
              name="id"
              type="number"
              step="0.01"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="id-error"
              defaultValue={place.id}
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
        {/* Select Category Id */}
        <div className="mb-4">
          <label
            htmlFor="category_id"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Category
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="category_id"
              name="category_id"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="category_id-error"
              onChange={(event) => {
                setSelectedCategoryId(Number(event.target.value)); // Convert the selected category ID to a number
              }}
              defaultValue={place.categoryId}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div id="category_id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category_id &&
              state.errors.category_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Select Subcategory Id */}
        <div className="mb-4">
          <label
            htmlFor="subcategory_id"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Subcategory
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="subcategory_id"
              name="subcategory_id"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="subcategory_id-error"
              defaultValue={place.subcategoryId}
            >
              <option value="">Select subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
          <div id="subcategory_id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.subcategory_id &&
              state.errors.subcategory_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              defaultValue={place.name}
            />
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
              defaultValue={place.descriptionEs}
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
              defaultValue={place.descriptionEn}
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
        {/* Trick es */}
        <div className="mb-4">
          <label
            htmlFor="trick_es"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Trick ES
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="trick_es"
              name="trick_es"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="trick_es-error"
              defaultValue={place.trickEs}
            />
          </div>

          <div id="trick_es-error" aria-live="polite" aria-atomic="true">
            {state.errors?.trick_es &&
              state.errors.trick_es.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Trick en */}
        <div className="mb-4">
          <label
            htmlFor="trick_en"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Trick EN
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="trick_en"
              name="trick_en"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="trick_en-error"
              defaultValue={place.trickEn}
            />
          </div>

          <div id="trick_en-error" aria-live="polite" aria-atomic="true">
            {state.errors?.trick_en &&
              state.errors.trick_en.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Schedules es */}
        <div className="mb-4">
          <label
            htmlFor="schedules_es"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Schedules ES
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="schedules_es"
              name="schedules_es"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="schedules_es-error"
              defaultValue={place.schedulesEs}
            />
          </div>

          <div id="schedules_es-error" aria-live="polite" aria-atomic="true">
            {state.errors?.schedules_es &&
              state.errors.schedules_es.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Schedules en */}
        <div className="mb-4">
          <label
            htmlFor="schedules_en"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Schedules EN
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="schedules_en"
              name="schedules_en"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="schedules_en-error"
              defaultValue={place.schedulesEn}
            />
          </div>

          <div id="schedules_en-error" aria-live="polite" aria-atomic="true">
            {state.errors?.schedules_en &&
              state.errors.schedules_en.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Booking es */}
        <div className="mb-4">
          <label
            htmlFor="booking_es"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Booking ES
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="booking_es"
              name="booking_es"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="booking_es-error"
              defaultValue={place.bookingEs}
            />
          </div>

          <div id="booking_es-error" aria-live="polite" aria-atomic="true">
            {state.errors?.booking_es &&
              state.errors.booking_es.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Booking en */}
        <div className="mb-4">
          <label
            htmlFor="booking_en"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Booking EN
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="booking_en"
              name="booking_en"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="booking_en-error"
              defaultValue={place.bookingEn}
            />
          </div>

          <div id="booking_en-error" aria-live="polite" aria-atomic="true">
            {state.errors?.booking_en &&
              state.errors.booking_en.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Address */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Address
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="address"
              name="address"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="address-error"
              defaultValue={place.address}
            />
          </div>

          <div id="address-error" aria-live="polite" aria-atomic="true">
            {state.errors?.address &&
              state.errors.address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Lat and Lng */}
        <div className="flex-between mb-4 flex w-full gap-10">
          <div className="w-full">
            <label
              htmlFor="lat"
              className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
            >
              Lat
            </label>
            <div className="relative mt-2 w-full rounded-md">
              <input
                id="lat"
                name="lat"
                type="number"
                step="0.01"
                className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="lat-error"
                defaultValue={place.lat}
              />
            </div>

            <div id="lat-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lat &&
                state.errors.lat.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Lng */}
          <div className="w-full">
            <label
              htmlFor="lng"
              className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
            >
              Lng
            </label>
            <div className="relative mt-2 w-full rounded-md">
              <input
                id="lng"
                name="lng"
                type="number"
                step="0.01"
                className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="lng-error"
                defaultValue={place.lng}
              />
            </div>

            <div id="lng-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lng &&
                state.errors.lng.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* Phones */}
        <div className="mb-4">
          <label
            htmlFor="phones"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Phones
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="phones"
              name="phones"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="phones-error"
              defaultValue={place.phones}
            />
          </div>

          <div id="phones-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phones &&
              state.errors.phones.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* City */}
        <div className="mb-4">
          <label
            htmlFor="city"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            City
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="city"
              name="city"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="city-error"
              defaultValue={place.city}
            />
          </div>

          <div id="city-error" aria-live="polite" aria-atomic="true">
            {state.errors?.city &&
              state.errors.city.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Instagram */}
        <div className="mb-4">
          <label
            htmlFor="instagram"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Instagram
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="instagram"
              name="instagram"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="instagram-error"
              defaultValue={place.instagram}
            />
          </div>

          <div id="instagram-error" aria-live="polite" aria-atomic="true">
            {state.errors?.instagram &&
              state.errors.instagram.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Avg Price */}
        <div className="mb-4">
          <label
            htmlFor="avgPrice"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Avg Price
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="avgPrice"
              name="avgPrice"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="avgPrice-error"
              defaultValue={place.avgPrice}
            />
          </div>

          <div id="avgPrice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.avgPrice &&
              state.errors.avgPrice.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Google Map Link */}
        <div className="mb-4">
          <label
            htmlFor="googleMapLink"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Google Map Link
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="googleMapLink"
              name="googleMapLink"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="googleMapLink-error"
              defaultValue={place.googleMapLink}
            />
          </div>

          <div id="googleMapLink-error" aria-live="polite" aria-atomic="true">
            {state.errors?.googleMapLink &&
              state.errors.googleMapLink.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Official URL */}
        <div className="mb-4">
          <label
            htmlFor="official_url"
            className="mb-2 block w-min whitespace-nowrap text-sm font-medium"
          >
            Official URL
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="official_url"
              name="official_url"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 px-5 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="official_url-error"
              defaultValue={place.officialUrl}
            />
          </div>

          <div id="official_url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.official_url &&
              state.errors.official_url.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
              defaultChecked={place.active}
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
        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/places"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Place</Button>
      </div>
    </form>
  );
}
