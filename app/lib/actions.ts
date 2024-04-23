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

const FormSubcategorySchema = FormCategorySchema.extend({
  id: z
    .string()
    .nonempty({
      message: 'Please enter an id.',
    })
    .refine(
      (value) => {
        const id = parseInt(value);
        return id !== 0;
      },
      {
        message: 'ID cannot be zero.',
      },
    ),
  categoryId: z.string().nonempty({
    message: 'Please enter a categoryId.',
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

const CreateSubcategory = FormSubcategorySchema.omit({});
const UpdateSubcategory = FormSubcategorySchema.omit({
  id: true,
  categoryId: true,
});
const CreateCategory = FormCategorySchema.omit({});
const UpdateCategory = FormCategorySchema.omit({ id: true });

// This is temporary
export type State = {
  errors?: {
    id?: string[];
    name?: string[];
    t_name?: string[];
    icon?: string[];
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
      LEFT JOIN categories c ON c.id = ANY(p.categories)
      LEFT JOIN subcategories s ON s.id = ANY(p.subcategories)
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
      ORDER BY p.name ASC
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
