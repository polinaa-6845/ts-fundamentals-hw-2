import './style.css';
import { getImagesByQuery } from "./pixabay-api";
import { initRender } from "./render-functions";
import Pagination from "./pagination";

const pagination = new Pagination();
let query: string = "";

// Типизируем выборку элементов
const searchForm = document.querySelector<HTMLFormElement>(".form");
const loadMoreButton = document.querySelector<HTMLButtonElement>(".load-more");
const gallery = document.querySelector<HTMLUListElement>(".gallery");
const loader = document.querySelector<HTMLParagraphElement>(".loader"); // В HTML это <p>

// Проверки на существование элементов
if (!searchForm) throw new Error("Missing .form element in HTML");
if (!loadMoreButton) throw new Error("Missing .load-more element in HTML");
if (!gallery) throw new Error("Missing .gallery element in HTML");
if (!loader) throw new Error("Missing .loader element in HTML");

// Инициализируем рендер
const ui = initRender({ gallery, loader, loadMoreButton });

searchForm.addEventListener("submit", onFormSubmit);
loadMoreButton.addEventListener("click", onLoadMoreClick);

async function onFormSubmit(event: Event): Promise<void> {
  event.preventDefault();
  
  const form = event.currentTarget as HTMLFormElement;
  const elements = form.elements as HTMLFormControlsCollection;
  
  const input = elements.namedItem("search-text") as HTMLInputElement;
  
  query = input.value.trim();

  if (query === "") {
    ui.showToast("Please enter a search query.");
    return;
  }

  pagination.reset();
  ui.clearGallery();
  ui.hideLoadMoreButton();
  await fetchAndRender();
  form.reset();
}

async function onLoadMoreClick(): Promise<void> {
  pagination.next();
  await fetchAndRender();
}

async function fetchAndRender(): Promise<void> {
  const isInitial = pagination.current === 1;
  try {
    ui.showLoader();
    ui.hideLoadMoreButton();

    const data = await getImagesByQuery(query, pagination.current);

    if (isInitial && data.hits.length === 0) {
      ui.showToast(
        "There are no images matching your search query. Try again!"
      );
      return;
    }

    ui.createGallery(data.hits);

    const isEndOfResults = pagination.isEnd(data.totalHits);
    if (isEndOfResults) {
      ui.hideLoadMoreButton();
      ui.showToast("You've reached the end of search results.");
      return;
    }

    ui.showLoadMoreButton();
  } catch (error) {
    console.error(error);
    ui.showToast("An error occurred while fetching images. Try again.");
  } finally {
    ui.hideLoader();
  }
}