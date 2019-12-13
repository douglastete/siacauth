import { apiClient } from '../../assets/js/axios.factory';

export async function insertNewUser() {
  await apiClient()
    .post('/users')
    .then(resp => {
      return resp.data;
    });
}
