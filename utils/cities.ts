import { City } from '@/types/cities'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export const getAllCity = async (): Promise<City[]> => {
  const response = await axios.get(`${BASE_URL}/api/cities`)
  return response.data.data
}
