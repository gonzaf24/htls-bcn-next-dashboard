// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Category = {
  id: number;
  name: string;
  t_name: string;
  icon: string;
};

export type Subcategory = {
  id: number;
  category_id: number;
  name: string;
  t_name: string;
  icon: string;
};

export type FormattedCategoriesTable = {
  id: number;
  name: string;
  t_name: string;
  icon: string;
};

export type FormattedSubcategoriesTable = {
  id: number;
  category_id: number;
  name: string;
  t_name: string;
  icon: string;
};

export type PlacesTable = {
  id: string;
  categoryId: number;
  subcategoryId: number;
  name: string;
  photos: string[];
  lat: number;
  lng: number;
  descriptionEs: string;
  descriptionEn: string;
  categoryIcon: string;
  subcategoryIcon: string;
  categoryName: string;
  subcategoryName: string;
  address?: string;
  phones?: string;
  bookingEs?: string;
  bookingEn?: string;
  trickEs?: string;
  trickEn?: string;
  schedulesEs?: string;
  schedulesEn?: string;
  city?: string;
  instagram?: string;
  avgPrice?: string;
  googleMapLink?: string;
  officialUrl?: string;
  active?: boolean;
  lastUpdate?: string; // Puede que necesites ajustar el tipo de este campo dependiendo del formato de fecha que uses en tu base de datos
  date?: string; // Puede que necesites ajustar el tipo de este campo dependiendo del formato de fecha que uses en tu base de datos
};

export type EventsTable = {
  id: string;
  title: string;
  descriptionEn: string;
  descriptionEs: string;
  dateStart: string;
  dateEnd: string;
  photos: string[];
  tags: string[];
  free: boolean;
  price: number;
  ticketsLink: string;
  instagramLink: string;
  officialLink: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  active: boolean;
  approved: boolean;
  date: string;
};

export type UserTable = {
  id: string;
  name: string;
  email: string;
  image: string;
  date: string;
  role: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type CarouselProps = {
  photos: string[];
};

/// old app code
/* 


export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
 */
