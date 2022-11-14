import axios from 'axios';
const API_KEY = '31185882-33d75530acb6f2e03ef303dd9';

export function searchImage(name, page) {
  return axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
}
