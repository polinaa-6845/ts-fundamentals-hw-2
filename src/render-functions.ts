import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import type { PixabayImage } from "./types/pixabay";
import "izitoast/dist/css/iziToast.min.css";
import "simplelightbox/dist/simple-lightbox.min.css";

export interface RenderAPI {
  createGallery: (images: PixabayImage[]) => void;
  clearGallery: () => void;
  showLoader: () => void;
  hideLoader: () => void;
  showLoadMoreButton: () => void;
  hideLoadMoreButton: () => void;
  showToast: (text: string) => void;
}
export interface RenderElements {
  gallery: HTMLUListElement;
  loader: HTMLElement;
  loadMoreButton: HTMLButtonElement;
}

export function initRender(elements: RenderElements): RenderAPI {
  const { gallery, loader, loadMoreButton } = elements;

  loader.style.display = "none";
  loadMoreButton.style.display = "none";

  const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
  });

  const createGallery = (images: PixabayImage[]): void => {
    const galleryItems = images
      .map(
        (image) => `
          <li class="gallery-item">
            <a class="gallery-link" href="${image.largeImageURL}">
              <img
                class="gallery-image"
                src="${image.webformatURL}"
                alt="${image.tags}"
                title="${image.tags}"
                width="100"
                height="100"
                loading="lazy"
              />
            </a>
          </li>`
      )
      .join("");

    gallery.insertAdjacentHTML("beforeend", galleryItems);
    lightbox.refresh();
  };

  const clearGallery = (): void => {
    gallery.innerHTML = "";
  };

  const showLoader = (): void => {
    loader.style.display = "block";
  };

  const hideLoader = (): void => {
    loader.style.display = "none";
  };

  const showLoadMoreButton = (): void => {
    loadMoreButton.style.display = "block";
  };

  const hideLoadMoreButton = (): void => {
    loadMoreButton.style.display = "none";
  };

  const showToast = (text: string): void => {
    iziToast.info({ message: text, position: "topRight" });
  };

  return {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
    showToast,
  };
}