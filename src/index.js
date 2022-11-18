import { crateImageMarkUp } from './gallery';
import { searchImage } from './search-image';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { formRefs, btnRefs, gallery, endGalleryMessageRefs } from './refs';

// function the card
function renderImage(arr) {
  const markUp = arr.map(item => crateImageMarkUp(item));
  gallery.insertAdjacentHTML('beforeend', markUp.join(''));
}

let lightbox = new SimpleLightbox('.photo-card a', {
  animationSlide: true,
  animationSpeed: 250,
  nav: true,
  close: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let totalImg = 0;
let inputValue = '';
let response = '';

// Listener submit
formRefs.addEventListener('submit', onSubmitSearch);

//  asinc function submit
function onSubmitSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  totalImg = 40;

  // value the form
  inputValue = event.currentTarget.elements.searchQuery.value;

  if (!inputValue) {
    gallery.innerHTML = '';
    return;
  }
  renderMarkUp(inputValue);
  lightbox.refresh();
}

async function renderMarkUp(value) {
  try {
    response = await searchImage(value, currentPage);
    endGalleryMessageRefs.classList.add('is-hidden');
    if (response.data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderImage(response.data.hits);
    lightbox.refresh();
    scrollPage();
    if (currentPage === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }
  } catch (error) {
    console.error(error);
  }
}

// function smooth scroll
function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 0,
    behavior: 'smooth',
  });
}

//  scroll window Listener
window.addEventListener('scroll', infinityScroll);

// function scroll
function infinityScroll() {
  const documentRef = document.documentElement.getBoundingClientRect();
  if (
    totalImg > response.data.totalHits &&
    documentRef.bottom < document.documentElement.clientHeight
  ) {
    endGalleryMessageRefs.classList.remove('is-hidden');
    return;
  }
  if (documentRef.bottom < document.documentElement.clientHeight) {
    currentPage += 1;
    totalImg += response.data.hits.length;
    renderMarkUp(inputValue);
    lightbox.refresh();
  }
}
