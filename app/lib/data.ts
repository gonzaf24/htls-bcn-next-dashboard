import { sql } from '@vercel/postgres';
import {
  User,
  Category,
  Subcategory,
  PlacesTable,
  UserTable,
  EventsTable,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { mapEventsDataToEvents, mapPlaceDataToPlace } from './mapping-data';

export const fetchCategoriesData = async () => {
  noStore();
  try {
    const data = await sql`SELECT * FROM categories ORDER BY id ASC`;
    return data.rows as Category[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
};

export async function fetchSubcategoriesData() {
  noStore();
  try {
    const data = await sql`SELECT * FROM subcategories ORDER BY id ASC`;
    return data.rows as Subcategory[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchCategoryById(id: number) {
  noStore();
  try {
    const data = await sql<Category>`SELECT * FROM categories WHERE id=${id}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchPlacesPages(query: string) {
  noStore();
  try {
    const count = await sql`
  SELECT COUNT(*)
  FROM places
  WHERE
    CAST(places.id AS TEXT) ILIKE ${`%${query}%`} OR
    places.name ILIKE ${`%${query}%`} OR
    places.address ILIKE ${`%${query}%`} OR
    places.city ILIKE ${`%${query}%`} OR
    places.instagram ILIKE ${`%${query}%`} OR
    places.official_url ILIKE ${`%${query}%`} OR
    places.description_es ILIKE ${`%${query}%`} OR
    places.description_en ILIKE ${`%${query}%`} OR
    places.trick_es ILIKE ${`%${query}%`} OR
    places.trick_en ILIKE ${`%${query}%`} 
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
    //throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchEventsPages(query: string) {
  noStore();
  try {
    const count = await sql`
  SELECT COUNT(*)
  FROM events
  WHERE
    CAST(events.id AS TEXT) ILIKE ${`%${query}%`} OR
    events.title ILIKE ${`%${query}%`} OR
    events.description_en ILIKE ${`%${query}%`} OR
    events.description_es ILIKE ${`%${query}%`} OR
    ${`%${query}%`} = ANY(events.tags) OR
    events.contact_name ILIKE ${`%${query}%`} OR
    events.contact_email ILIKE ${`%${query}%`} OR
    events.contact_phone ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
    //throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchFilteredPlaces(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<PlacesTable>`
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
        p.last_update,
        c.icon as category_icon,
        s.icon as subcategory_icon,
        c.name as category_name,
        s.name as subcategory_name
      FROM places p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories s ON s.id = p.subcategory_id
      WHERE
        CAST(p.id AS TEXT) ILIKE ${`%${query}%`} OR
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

    const places: PlacesTable[] = data.rows.map((row: PlacesTable) =>
      mapPlaceDataToPlace(row),
    );
    return places;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch places.');
  }
}

export async function fetchFilteredEvents(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<EventsTable>`
        SELECT
          e.id,
          e.title,
          e.description_en,
          e.description_es,
          e.date_start,
          e.date_end,
          e.photos,
          e.tags,
          e.free,
          e.price,
          e.approved,
          e.tickets_link,
          e.instagram_link,
          e.official_link,
          e.active,
          e.contact_name,
          e.contact_email,
          e.contact_phone,
          e.date
        FROM events e
        WHERE
          CAST(e.id AS TEXT) ILIKE ${`%${query}%`} OR
          e.title ILIKE ${`%${query}%`} OR
          e.description_en ILIKE ${`%${query}%`} OR
          e.description_es ILIKE ${`%${query}%`} OR
          ${`%${query}%`} = ANY(e.tags) OR
          e.contact_name ILIKE ${`%${query}%`} OR
          e.contact_email ILIKE ${`%${query}%`} OR
          e.contact_phone ILIKE ${`%${query}%`}
        ORDER BY e.date ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    const events: EventsTable[] = data.rows.map((row: EventsTable) =>
      mapEventsDataToEvents(row),
    );

    return events;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch places.');
  }
}

export async function getCategoriesMaxId() {
  try {
    const data = await sql`SELECT MAX(id) FROM categories`;
    return data.rows[0].max;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
  }
}

export async function fetchSubcategoryById(id: number) {
  noStore();
  try {
    const data =
      await sql<Subcategory>`SELECT * FROM subcategories WHERE id=${id}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function getSubcategoriesByCategoryId(categoryId: number) {
  try {
    const data = await sql<Subcategory>`
      SELECT * FROM subcategories WHERE category_id=${categoryId}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
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

export async function getPlacesMaxId() {
  try {
    const data = await sql`SELECT MAX(id) FROM places`;
    return data.rows[0].max;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
  }
}

export async function fetchPlace(id: number) {
  noStore();
  try {
    const data = await sql<PlacesTable>`
      SELECT
        p.id,
        p.category_id,
        p.subcategory_id,
        p.name,
        p.address,
        p.city,
        p.phones,
        p.photos,
        p.instagram,
        p.official_url,
        p.description_es,
        p.description_en,
        p.schedules_es,
        p.schedules_en,
        p.trick_es,
        p.trick_en,
        p.booking_es,
        p.booking_en,
        p.avg_price,
        p.google_map_link,
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
      WHERE p.id=${id}
    `;
    const place = data.rows[0] ? mapPlaceDataToPlace(data.rows[0]) : null;
    return place;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchEvent(id: string) {
  noStore();
  try {
    const data = await sql<EventsTable>`
      SELECT
        e.id,
        e.title,
        e.description_en,
        e.description_es,
        e.date_start,
        e.date_end,
        e.photos,
        e.tags,
        e.free,
        e.price,
        e.approved,
        e.tickets_link,
        e.instagram_link,
        e.official_link,
        e.active,
        e.contact_name,
        e.contact_email,
        e.contact_phone,
        e.date
      FROM events e
      WHERE e.id=${id}
    `;
    const event = data.rows[0] ? mapEventsDataToEvents(data.rows[0]) : null;
    return event;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}


export async function fetchUsersPages(query: string) {
  noStore();
  try {
    const count = await sql`
  SELECT COUNT(*)
  FROM users
  WHERE
    CAST(id AS TEXT) ILIKE ${`%${query}%`} OR
    name ILIKE ${`%${query}%`} OR
    email ILIKE ${`%${query}%`} OR
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
    //throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchHtlsUsers(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<UserTable>`
      SELECT
        id,
        name,
        email,
        image,
        date
      FROM users
      WHERE
        CAST(id AS TEXT) ILIKE ${`%${query}%`} OR
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      ORDER BY date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const users: UserTable[] = data.rows;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch places.');
  }
}

export async function fetchDashboardUsers() {
  noStore();
  try {
    const data = await sql<UserTable>`
      SELECT
        id,
        name,
        email,
        role
      FROM dashboard_users
    `;

    const users: UserTable[] = data.rows;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch places.');
  }
}

/////OLD APP DATA

/* export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    //throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    //throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      numberOfCustomers: 0,
      numberOfInvoices: 0,
      totalPaidInvoices: 0,
      totalPendingInvoices: 0,
    };
    //throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
    //throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
    //throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    return [];
    //throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    return [];
    //throw new Error('Failed to fetch customer table.');
  }
} */

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM dashboard_users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
