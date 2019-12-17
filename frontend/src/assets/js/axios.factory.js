import Axios from 'axios';

import { authFirebase } from './auth';

export function apiClient() {
  return Axios.create({
    baseURL: 'https://siacauth.now.sh/api/v1',
    headers: {
      Authorization: `Bearer ${authFirebase.token}`
    }
  });
}
