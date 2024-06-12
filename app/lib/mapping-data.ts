import { EventsTable, PlacesTable } from './definitions';

// Función para mapear los datos de un lugar a un objeto Place
export const mapPlaceDataToPlace = (placeData: any): PlacesTable => ({
  id: placeData.id,
  categoryId: placeData.category_id,
  subcategoryId: placeData.subcategory_id,
  name: placeData.name,
  photos: placeData.photos
    .toString()
    .split(',')
    .map((url: string) => url.trim()),
  lat: placeData.lat,
  lng: placeData.lng,
  descriptionEs: placeData.description_es,
  descriptionEn: placeData.description_en,
  categoryIcon: placeData.category_icon,
  subcategoryIcon: placeData.subcategory_icon,
  categoryName: placeData.category_name,
  subcategoryName: placeData.subcategory_name,
  address: placeData.address,
  phones: placeData.phones,
  bookingEs: placeData.booking_es,
  bookingEn: placeData.booking_en,
  trickEs: placeData.trick_es,
  trickEn: placeData.trick_en,
  schedulesEs: placeData.schedules_es,
  schedulesEn: placeData.schedules_en,
  city: placeData.city,
  instagram: placeData.instagram,
  avgPrice: placeData.avg_price,
  googleMapLink: placeData.google_map_link,
  officialUrl: placeData.official_url,
  active: placeData.active,
  lastUpdate: placeData.last_update,
});

export const mapEventsDataToEvents = (eventsData: any): EventsTable => ({
  id: eventsData.id,
  title: eventsData.title,
  descriptionEn: eventsData.description_en,
  descriptionEs: eventsData.description_es,
  dateStart: eventsData.date_start,
  dateEnd: eventsData.date_end,
  photos: eventsData.photos
    .toString()
    .split(',')
    .map((url: string) => url.trim()),
  tags: eventsData.tags
    .toString()
    .split(',')
    .map((tag: string) => tag.trim()),
  priority: eventsData.priority,
  locationName: eventsData.location_name,
  locationAddress: eventsData.location_address,
  locationGooglemapsLink: eventsData.location_googlemaps_link,
  free: eventsData.free,
  price: eventsData.price,
  ticketsLink: eventsData.tickets_link,
  instagramLink: eventsData.instagram_link,
  officialLink: eventsData.official_link,
  active: eventsData.active,
  approved: eventsData.approved,
  contactName: eventsData.contact_name,
  contactEmail: eventsData.contact_email,
  contactPhone: eventsData.contact_phone,
  date: eventsData.date,
});
