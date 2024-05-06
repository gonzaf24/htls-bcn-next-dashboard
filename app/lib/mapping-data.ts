import { PlacesTable } from './definitions';

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
