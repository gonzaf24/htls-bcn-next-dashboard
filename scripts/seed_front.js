const { db } = require('@vercel/postgres');
const {
  categories,
  subcategories,
  places,
} = require('./placeholder-data_front');
const bcrypt = require('bcrypt');

async function seedCategories(client) {
  try {
    // Crear la extensión "uuid-ossp" si no existe
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Crear la tabla "categories" si no existe
    const createCategoriesTable = await client.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        t_name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "categories" table`);

    // Insertar datos en la tabla "categories"
    const insertedCategories = await Promise.all(
      categories.map(async (category) => {
        return client.sql`
          INSERT INTO categories (id, name, t_name, icon)
          VALUES (${category.id}, ${category.name}, ${category.t_name}, ${category.icon})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );

    console.log(`Seeded ${insertedCategories.length} categories`);

    return {
      createCategoriesTable,
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedSubcategories(client) {
  try {
    // Crear la tabla "subcategories" si no existe
    const createSubcategoriesTable = await client.sql`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INTEGER NOT NULL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        name VARCHAR(255) NOT NULL,
        t_name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "subcategories" table`);

    // Insertar datos en la tabla "subcategories"
    const insertedSubcategories = await Promise.all(
      subcategories.map(async (subcategory) => {
        return client.sql`
          INSERT INTO subcategories (id, category_id, name,  t_name, icon)
          VALUES ( ${subcategory.id}, ${subcategory.category_id}, ${subcategory.name}, ${subcategory.t_name}, ${subcategory.icon})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );

    console.log(`Seeded ${insertedSubcategories.length} subcategories`);

    return {
      createSubcategoriesTable,
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedPlaces(client) {
  try {
    // Crear la secuencia "custom_id_seq" si no existe
    const createIdSequence = await client.sql`
    CREATE SEQUENCE custom_id_seq
    INCREMENT 1
    MINVALUE 1000
    MAXVALUE 999999
    START 1000
    CACHE 1;
  `;

    // Crear la tabla "places" si no existe
    const createPlacesTable = await client.sql`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER DEFAULT nextval('custom_id_seq') PRIMARY KEY,
      category_id INTEGER REFERENCES categories(id),
      subcategory_id INTEGER REFERENCES subcategories(id),
      name VARCHAR(255) NOT NULL,
      photos TEXT[],
      lat FLOAT NOT NULL,
      lng FLOAT NOT NULL,
      description_es TEXT,
      description_en TEXT,
      trick_es TEXT,
      trick_en TEXT,
      schedules_es TEXT,
      schedules_en TEXT,
      booking_es TEXT,
      booking_en TEXT,
      address VARCHAR(255),
      phones VARCHAR(255),
      city VARCHAR(255),
      instagram VARCHAR(255),
      avg_price VARCHAR(255),
      google_map_link VARCHAR(255),
      official_url VARCHAR(255),
      active BOOLEAN,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    console.log(`Created "places" table`);

    // Insertar datos en la tabla "places"
    const insertedPlaces = await Promise.all(
      places.map(async (place) => {
        return client.sql`
          INSERT INTO places (category_id, subcategory_id, name, photos, lat, lng, description_es, description_en, trick_es, trick_en, schedules_es, schedules_en, address, phones,booking_es, booking_en, city, instagram, avg_price, google_map_link,  official_url, active )
          VALUES (
            ${place.category_id},
            ${place.subcategory_id},
            ${place.name},
            ${place.photos},
            ${place.lat},
            ${place.lng},
            ${place.description_es},
            ${place.description_en},
            ${place.trick_es},
            ${place.trick_en},
            ${place.schedules_es},
            ${place.schedules_en},
            ${place.address},
            ${place.phones},
            ${place.bookin_es},
            ${place.booking_en},
            ${place.city},
            ${place.instagram},
            ${place.avg_price},
            ${place.google_map_link},
            ${place.official_url},
            ${place.active}

          )
          ON CONFLICT (id) DO NOTHING;
          `;
      }),
    );

    console.log(`Seeded ${insertedPlaces.length} places`);

    return {
      createIdSequence,
      createPlacesTable,
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        alias TEXT NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        image TEXT,
        birth_year INTEGER CHECK (birth_year >= 1000 AND birth_year <= 9999),
        active BOOLEAN DEFAULT TRUE,
        sex CHAR(1) CHECK (sex IN ('F', 'M', 'O')),
        registered BOOLEAN DEFAULT FALSE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "users" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedBooksmarks(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Crear la tabla "bookmarks" si no existe
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        place_id INTEGER NOT NULL REFERENCES places(id),
        is_bookmarked BOOLEAN NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_place UNIQUE (user_id, place_id)
      );
    `;

    console.log(`Created "bookmarks" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating bookmarks table:', error);
    throw error;
  }
}

async function seedReviews(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        place_id INTEGER NOT NULL REFERENCES places(id),
        user_id UUID NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        text TEXT,
        active BOOLEAN DEFAULT TRUE,
        reason TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "reviews" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
}

async function seedEvents(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "events" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        title TEXT NOT NULL,
        description_en TEXT  NOT NULL,
        description_es TEXT NOT NULL,
        date_start TIMESTAMP NOT NULL,
        date_end TIMESTAMP NOT NULL,
        photos TEXT[],
        tags TEXT[],
        free BOOLEAN DEFAULT FALSE,
        price FLOAT,
        tickets_link TEXT,
        instagram_link TEXT,
        official_link TEXT,
        priority NUMERIC DEFAULT 0,
        location_name TEXT,
        location_address TEXT,
        location_googlemaps_link TEXT,
        contact_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        approved BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT false,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "events" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding events:', error);
    throw error;
  }
}

async function seedSuggestedTags(client) {
  try {
    // Crear la tabla "suggested_tags" si no existe
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS suggested_tags (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tag VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "suggested_tags" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating suggested_tags table:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedCategories(client);
  await seedSubcategories(client);
  await seedPlaces(client);
  await seedUsers(client);
  await seedBooksmarks(client);
  await seedReviews(client);
  await seedEvents(client);
  await seedSuggestedTags(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
