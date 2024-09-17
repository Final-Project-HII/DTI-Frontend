export type Warehouse = {
  id: number
  name: string
  addressLine: string
  city: {
    id: number
    name: string
  }
  postalCode: string
  lat: number
  lon: number
}
