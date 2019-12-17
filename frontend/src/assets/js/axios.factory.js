import Axios from 'axios';

import { authFirebase } from './auth';

export function apiClient() {
  return Axios.create({
    baseURL: process.env.API_URL_BASE,
    headers: {
      Authorization: `Bearer ${authFirebase.token}`
    }
  });
}
