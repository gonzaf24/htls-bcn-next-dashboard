'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { Category } from './definitions';

const FormCategorySchema = z.object({
  id: z.string().nonempty({
    message: 'Please enter an id.',
  }),
  name: z.string().nonempty({
    message: 'Please enter a name like: Bar',
  }),
  t_name: z.string().nonempty({
    message: 'Please enter a translation name like: cat_bar',
  }),
  icon: z.string().nonempty({
    message: 'Please enter an icon name like: bar.svg',
  }),
});

const FormSubcategorySchema = z.object({
  id: z.string().nonempty({
    message: 'Please enter an id.',
  }),
  categoryId: z.string().nonempty({
    message: 'Select a category.',
  }),
  name: z.string().nonempty({
    message: 'Please enter a name like: Bar',
  }),
  t_name: z.string().nonempty({
    message: 'Please enter a translation name like: cat_bar',
  }),
  icon: z.string().nonempty({
    message: 'Please enter an icon name like: bar.svg',
  }),
});

const FormPlaceSchema = z.object({
  id: z.string().nonempty({
    message: 'Please enter an id.',
  }),
  category_id: z.string().nonempty({
    message: 'Select a category.',
  }),
  subcategory_id: z.string().nonempty({
    message: 'Select a subcategory.',
  }),
  name: z.string().nonempty({
    message: 'Please enter a name for the place.',
  }),
  description_es: z.string().nonempty({
    message: 'Please enter a description in Spanish',
  }),
  description_en: z.string().nonempty({
    message: 'Please enter a description in English',
  }),
  lat: z.string().nonempty({
    message: 'Please enter a latitude',
  }),
  lng: z.string().nonempty({
    message: 'Please enter a longitude',
  }),
  city: z.string().nonempty({
    message: 'Please enter a city like BCN or MAD',
  }),
});

const FormEventSchema = z
  .object({
    title: z.string().nonempty({
      message: 'Please enter a title.',
    }),
    description_en: z.string().nonempty({
      message: 'Please enter a description in English.',
    }),
    description_es: z.string().nonempty({
      message: 'Please enter a description in Spanish.',
    }),
    date_start: z.string().nonempty({
      message: 'Please enter a start date.',
    }),
    date_end: z.string().nonempty({
      message: 'Please enter an end date.',
    }),
    contact_name: z.string().nonempty({
      message: 'Please enter a contact name.',
    }),
    contact_email: z.string().nonempty({
      message: 'Please enter a contact email.',
    }),
    contact_phone: z.string().nonempty({
      message: 'Please enter a contact phone.',
    }),
  })
  .superRefine((data, ctx) => {
    const dateStart = new Date(data.date_start);
    const dateEnd = new Date(data.date_end);

    if (dateEnd <= dateStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The end date must be after the start date.',
        path: ['date_end'], // This points to the specific field causing the issue
      });
    }
  });

const CreateEvent = FormEventSchema;
const CreatePlace = FormPlaceSchema;
const CreateSubcategory = FormSubcategorySchema;
const UpdateSubcategory = FormSubcategorySchema.omit({
  id: true,
  categoryId: true,
});
const CreateCategory = FormCategorySchema;
const UpdateCategory = FormCategorySchema.omit({ id: true });

// This is temporary
export type State = {
  errors?: {
    id?: string[];
    category_id?: string[];
    subcategory_id?: string[];
    name?: string[];
    t_name?: string[];
    icon?: string[];
    lat?: string[];
    lng?: string[];
    description_es?: string[];
    description_en?: string[];
    trick_es?: string[];
    trick_en?: string[];
    schedules_es?: string[];
    schedules_en?: string[];
    booking_es?: string[];
    booking_en?: string[];
    city?: string[];
    instagram?: string[];
    avgPrice?: string[];
    googleMapLink?: string[];
    official_url?: string[];
    address?: string[];
    phones?: string[];
    active?: string[];
    photos?: string[];
    price?: string[];
    official_link?: string[];
    instagram_link?: string[];
    tickets_link?: string[];
    free?: string[];
    title?: string[];
    date_start?: string[];
    date_end?: string[];
    contact_name?: string[];
    contact_email?: string[];
    contact_phone?: string[];
  };
  message?: string | null;
};

export type EventState = {
  errors?: {
    id?: string[];
    title?: string[];
    description_en?: string[];
    description_es?: string[];
    date_start?: string[];
    date_end?: string[];
    free?: string[];
    price?: string[];
    contact_name?: string[];
    contact_email?: string[];
    contact_phone?: string[];
    official_link?: string[];
    instagram_link?: string[];
    tickets_link?: string[];
    tags?: string[];
    active?: string[];
    approved?: string[];
  };
  message?: string | null;
};


const ITEMS_PER_PAGE = 6;

export async function fetchFilteredPlaces(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const places = await sql`
      SELECT
        p.id,
        p.category_id,
        p.subcategory_id,
        p.name,
        p.address,
        p.city,
        p.photos,
        p.instagram,
        p.official_url,
        p.description_es,
        p.description_en,
        p.trick_es,
        p.trick_en,
        p.booking_es,
        p.booking_en,
        p.active,
        p.lat,
        p.lng,
        c.icon as category_icon,
        s.icon as subcategory_icon,
        c.t_name as category_name,
        s.t_name as subcategory_name
      FROM places p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories s ON s.id = p.subcategory_id
      WHERE
        p.id::text ILIKE ${`%${query}%`} OR
        p.name ILIKE ${`%${query}%`} OR
        p.address ILIKE ${`%${query}%`} OR
        p.city ILIKE ${`%${query}%`} OR
        p.instagram ILIKE ${`%${query}%`} OR
        p.official_url ILIKE ${`%${query}%`} OR
        p.description_es ILIKE ${`%${query}%`} OR
        p.description_en ILIKE ${`%${query}%`} OR
        p.trick_es ILIKE ${`%${query}%`} OR
        p.trick_en ILIKE ${`%${query}%`} 
      ORDER BY p.last_update DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return places.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch places.');
  }
}

export async function createCategory(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateCategory.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    t_name: formData.get('t_name'),
    icon: formData.get('icon'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  // Prepare data for insertion into the database
  const { id, name, t_name, icon } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO categories (id, name, t_name, icon)
      VALUES (${id}, ${name}, ${t_name}, ${icon})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the places page and redirect the user.
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteCategory(id: number) {
  // throw new Error('Failed to Delete category');

  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/dashboard');
    return { message: 'Category deleted' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Category.' };
  }
}

export async function updateCategory(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateCategory.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    t_name: formData.get('t_name'),
    icon: formData.get('icon'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  const { name, t_name, icon } = validatedFields.data;

  try {
    await sql`
      UPDATE categories
      SET name = ${name}, t_name = ${t_name}, icon = ${icon}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Category.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function fetchCategories() {
  noStore();
  try {
    const data = await sql`SELECT * FROM categories`;
    return data.rows as Category[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function createSubcategory(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateSubcategory.safeParse({
    id: formData.get('id'),
    categoryId: formData.get('category_id'),
    name: formData.get('name'),
    t_name: formData.get('t_name'),
    icon: formData.get('icon'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Subcategory.',
    };
  }

  // Prepare data for insertion into the database
  const { id, categoryId, name, t_name, icon } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO subcategories (id, category_id, name, t_name, icon)
      VALUES (${id}, ${categoryId} , ${name}, ${t_name}, ${icon})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the places page and redirect the user.
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteSubcategory(id: number) {
  // throw new Error('Failed to Delete category');

  try {
    await sql`DELETE FROM subcategories WHERE id = ${id}`;
    revalidatePath('/dashboard');
    return { message: 'Subcategory deleted' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Subcategory.' };
  }
}

export async function updateSubcategory(
  id: number,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateSubcategory.safeParse({
    id: formData.get('id'),
    categoryId: formData.get('category_id'),
    name: formData.get('name'),
    t_name: formData.get('t_name'),
    icon: formData.get('icon'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Subcategory.',
    };
  }

  const { name, t_name, icon } = validatedFields.data;

  try {
    await sql`
      UPDATE subcategories
      SET name = ${name}, t_name = ${t_name}, icon = ${icon}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Subcategory.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function getSubcategoriesMaxId(categoryId: number) {
  try {
    const data =
      await sql`SELECT MAX(id) FROM subcategories WHERE category_id=${categoryId}`;
    return data.rows[0].max;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
  }
}

export async function createPlace(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreatePlace.safeParse({
    id: formData.get('id'),
    category_id: formData.get('category_id'),
    subcategory_id: formData.get('subcategory_id'),
    name: formData.get('name'),
    description_es: formData.get('description_es'),
    description_en: formData.get('description_en'),
    city: formData.get('city'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
  });

  const placeData = {
    trick_es: formData.get('trick_es') || '',
    trick_en: formData.get('trick_en') || '',
    schedules_es: formData.get('schedules_es') || '',
    schedules_en: formData.get('schedules_en') || '',
    booking_es: formData.get('booking_es') || '',
    booking_en: formData.get('booking_en') || '',
    address: formData.get('address') || '',
    phones: formData.get('phones') || '',
    instagram: formData.get('instagram') || '',
    avgPrice: formData.get('avgPrice') || '',
    googleMapLink: formData.get('googleMapLink') || '',
    official_url: formData.get('official_url') || '',
    active: formData.get('active') || '',
    photos: formData.getAll('photos') || '',
  };

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Place.',
    };
  }

  // Prepare data for insertion into the database
  const {
    category_id,
    subcategory_id,
    name,
    description_es,
    description_en,
    city,
    lat,
    lng,
  } = validatedFields.data;
  const {
    trick_es,
    trick_en,
    schedules_es,
    schedules_en,
    booking_es,
    booking_en,
    address,
    phones,
    instagram,
    avgPrice,
    googleMapLink,
    official_url,
    photos,
  } = placeData;

  // Insert data into the database
  try {
    await sql`
    INSERT INTO places (
      category_id,
      subcategory_id,
      name,
      description_es,
      description_en,
      city,
      lat,
      lng,
      trick_es,
      trick_en,
      schedules_es,
      schedules_en,
      booking_es,
      booking_en,
      address,
      phones,
      instagram,
      avg_price,
      google_map_link,
      official_url,
      active,
      photos
    ) VALUES (
      ${category_id},
      ${subcategory_id},
      ${name},
      ${description_es},
      ${description_en},
      ${city},
      ${lat},
      ${lng},
      ${String(trick_es)},
      ${String(trick_en)},
      ${String(schedules_es)},
      ${String(schedules_en)},
      ${String(booking_es)},
      ${String(booking_en)},
      ${String(address)},
      ${String(phones)},
      ${String(instagram)},
      ${String(avgPrice)},
      ${String(googleMapLink)},
      ${String(official_url)},
      ${false},
      ARRAY[${photos.map((url) => `${url}`).join(',')}]::text[]
    )
    `;
      
  } catch (error) {
    console.error('Database Error:', error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Place.',
    };
  }
  // Revalidate the cache for the places page and redirect the user.
  revalidatePath('/dashboard/places');
  redirect('/dashboard/places');

}

export async function createEvent(prevState: EventState, formData: FormData) {

  const validatedFields = CreateEvent.safeParse({
    title: formData.get('title'),
    description_en: formData.get('description_en'),
    description_es: formData.get('description_es'),
    date_start: formData.get('date_start'),
    date_end: formData.get('date_end'),
    contact_name: formData.get('contact_name'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone'),
  });

  const eventData = {
    tags: formData.getAll('tags') || '',
    free: formData.get('free') || (false as boolean),
    price: formData.get('price') || '' || 0,
    photos: formData.getAll('photos') || '',
    tickets_link: formData.get('tickets_link' || '')?.toString(),
    instagram_link: formData.get('instagram_link' || null)?.toString(),
    official_link: formData.get('official_link' || null)?.toString(),
  };

  const user_id= "6a3970f1-1ec6-4d53-a137-40e005fc52a2";

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Event.',
    };
  }
  const {
    title,
    description_en,
    description_es,
    date_start,
    date_end,
    contact_name,
    contact_email,
    contact_phone,
  } = validatedFields.data;

  const { tickets_link, instagram_link, official_link, photos, tags, free, price  } =
    eventData;

  try {
    await sql`
      INSERT INTO events (
        title,
        description_en,
        description_es,
        date_start,
        date_end,
        photos,
        tags,
        free,
        price,
        tickets_link,
        instagram_link,
        official_link,
        contact_name,
        contact_email,
        contact_phone,
        user_id
      ) VALUES (
        ${title},
        ${description_en},
        ${description_es},
        ${date_start},
        ${date_end},
        ARRAY[${photos.map((url) => `${url}`).join(',')}]::text[],
        ARRAY[${tags.map((tag) => `${tag}`).join(',')}]::text[],
        ${Boolean(free)},
        ${Number(price)},
        ${tickets_link},
        ${instagram_link},
        ${official_link},
        ${contact_name},
        ${contact_email},
        ${contact_phone},
        ${user_id}
      )
    `;

  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Event.' };
  }
  revalidatePath('/dashboard/events');
  redirect('/dashboard/events');
}

export async function updatePlace(prevState: State, formData: FormData) {
  const validatedFields = CreatePlace.safeParse({
    id: formData.get('id'),
    category_id: formData.get('category_id'),
    subcategory_id: formData.get('subcategory_id'),
    name: formData.get('name'),
    description_es: formData.get('description_es'),
    description_en: formData.get('description_en'),
    city: formData.get('city'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
  });

  const placeData = {
    trick_es: formData.get('trick_es') || '',
    trick_en: formData.get('trick_en') || '',
    schedules_es: formData.get('schedules_es') || '',
    schedules_en: formData.get('schedules_en') || '',
    booking_es: formData.get('booking_es') || '',
    booking_en: formData.get('booking_en') || '',
    address: formData.get('address') || '',
    phones: formData.get('phones') || '',
    instagram: formData.get('instagram') || '',
    avgPrice: formData.get('avgPrice') || '',
    googleMapLink: formData.get('googleMapLink') || '',
    official_url: formData.get('official_url') || '',
    active: formData.get('active') || '',
    photos: formData.getAll('photos') || '',
  };

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Place.',
    };
  }

  const {
    id,
    category_id,
    subcategory_id,
    name,
    description_es,
    description_en,
    city,
    lat,
    lng,
  } = validatedFields.data;
  const {
    trick_es,
    trick_en,
    schedules_es,
    schedules_en,
    booking_es,
    booking_en,
    address,
    phones,
    instagram,
    avgPrice,
    googleMapLink,
    official_url,
    active,
    photos,
  } = placeData;

  try {
    await sql`
      UPDATE places
      SET
        category_id = ${category_id},
        subcategory_id = ${subcategory_id},
        name = ${name},
        description_es = ${description_es},
        description_en = ${description_en},
        city = ${city},
        lat = ${lat},
        lng = ${lng},
        trick_es = ${String(trick_es)},
        trick_en = ${String(trick_en)},
        schedules_es = ${String(schedules_es)},
        schedules_en = ${String(schedules_en)},
        booking_es = ${String(booking_es)},
        booking_en = ${String(booking_en)},
        address = ${String(address)},
        phones = ${String(phones)},
        instagram = ${String(instagram)},
        avg_price = ${String(avgPrice)},
        google_map_link = ${String(googleMapLink)},
        official_url = ${String(official_url)},
        active = ${Boolean(active)},
        photos = ARRAY[${photos.map((url) => `${url}`).join(',')}]::text[],
        last_update = NOW()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Place.' };
  }

  revalidatePath('/dashboard/places');
  redirect('/dashboard/places');
}

export async function updateEvent(prevState: EventState, formData: FormData) {
  const validatedFields = CreateEvent.safeParse({
    title: formData.get('title'),
    description_en: formData.get('description_en'),
    description_es: formData.get('description_es'),
    date_start: formData.get('date_start'),
    date_end: formData.get('date_end'),
    contact_name: formData.get('contact_name'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone'),
  });

  const eventData = {
    id: formData.get('id' || '')?.toString(),
    tags: formData.getAll('tags') || '',
    free: formData.get('free') || (false as boolean),
    price: formData.get('price') || '' || 0,
    photos: formData.getAll('photos') || '',
    tickets_link: formData.get('tickets_link' || '')?.toString(),
    instagram_link: formData.get('instagram_link' || null)?.toString(),
    official_link: formData.get('official_link' || null)?.toString(),
  };

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Event.',
    };
  }
  const {
    title,
    description_en,
    description_es,
    date_start,
    date_end,
    contact_name,
    contact_email,
    contact_phone,
  } = validatedFields.data;

  const { id, tickets_link, instagram_link, official_link, photos, tags, free, price  } =
    eventData;

  try {
    await sql`
      UPDATE events
      SET
        title = ${title},
        description_en = ${description_en},
        description_es = ${description_es},
        date_start = ${date_start},
        date_end = ${date_end},
        photos = ARRAY[${photos.map((url) => `${url}`).join(',')}]::text[],
        tags = ARRAY[${tags.map((tag) => `${tag}`).join(',')}]::text[],
        free = ${Boolean(free)},
        price = ${Number(price)},
        tickets_link = ${tickets_link},
        instagram_link = ${instagram_link},
        official_link = ${official_link},
        contact_name = ${contact_name},
        contact_email = ${contact_email},
        contact_phone = ${contact_phone}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Event.' };
  }

  revalidatePath('/dashboard/events');
  redirect('/dashboard/events');
}


export async function deletePlace(id: string) {
  // throw new Error('Failed to Delete category');

  try {
    await sql`DELETE FROM places WHERE id = ${id}`;
    revalidatePath('/dashboard/places');
    return { message: 'Place deleted' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Place.' };
  }
}

export async function deleteEvent(id: string) {
  try {
    await sql`DELETE FROM events WHERE id = ${id}`;
    revalidatePath('/dashboard/events');
    return { message: 'Event deleted' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Event.' };
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
