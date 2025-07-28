let searchTimeout;
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchInfo = document.getElementById("searchInfo");
const searchLoading = document.getElementById("searchLoading");
const noResults = document.getElementById("noResults");
const searchResultsGrid = document.getElementById("searchResultsGrid");

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("q") || "";

if (initialQuery) {
  searchInput.value = initialQuery;
  performFullSearch(initialQuery);
}

searchInput.addEventListener("input", function () {
  const query = this.value.trim();

  clearTimeout(searchTimeout);

  if (query.length < 2) {
    searchResults.classList.add("hidden");
    return;
  }

  searchTimeout = setTimeout(() => {
    performHeaderSearch(query);
  }, 300);
});

document.addEventListener("click", function (event) {
  if (
    !searchInput.contains(event.target) &&
    !searchResults.contains(event.target)
  ) {
    searchResults.classList.add("hidden");
  }
});

searchInput.addEventListener("focus", function () {
  if (this.value.trim().length >= 2) {
    searchResults.classList.remove("hidden");
  }
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const query = this.value.trim();
    if (query.length >= 2) {
      searchResults.classList.add("hidden");
      performFullSearch(query);

      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(query)}`
      );
    }
  }
});

async function performHeaderSearch(query) {
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&limit=5`
    );
    const results = await response.json();

    displayHeaderSearchResults(results, query);
  } catch (error) {
    console.error("Search error:", error);
  }
}

function displayHeaderSearchResults(results, query) {
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        <p>No results found for "${query}"</p>
      </div>
    `;
  } else {
    const resultsHTML = results
      .map(
        (result) => `
        <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 search-result"
             data-slug="${result.slug}">
          <div class="font-semibold text-gray-800">${result.word}</div>
          <div class="text-sm text-gray-600 mt-1">${stripHTML(
            result.definition
          )}</div>
        </div>
      `
      )
      .join("");

    searchResults.innerHTML = resultsHTML;
  }

  searchResults.classList.remove("hidden");
}

async function performFullSearch(query) {
  try {
    searchLoading.classList.remove("hidden");
    noResults.classList.add("hidden");
    searchResultsGrid.innerHTML = "";

    searchInfo.textContent = `Searching for "${query}"...`;

    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&limit=50`
    );
    const results = await response.json();

    searchLoading.classList.add("hidden");

    if (results.length === 0) {
      searchInfo.textContent = `No results found for "${query}"`;
      noResults.classList.remove("hidden");
    } else {
      searchInfo.textContent = `Found ${results.length} result${
        results.length !== 1 ? "s" : ""
      } for "${query}"`;
      displayFullSearchResults(results);
    }
  } catch (error) {
    console.error("Search error:", error);
    searchLoading.classList.add("hidden");
    searchInfo.textContent = `Error searching for "${query}"`;
    noResults.classList.remove("hidden");
  }
}

function displayFullSearchResults(results) {
  const resultsHTML = results
    .map(
      (result) => `
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer search-result"
           data-slug="${result.slug}">
        <h3 class="text-xl font-bold text-gray-800 mb-2">${result.word}</h3>
        <p class="text-gray-600 mb-3">${stripHTML(result.definition)}</p>
        ${
          result.example
            ? `
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 italic">
            <strong>Example:</strong> ${stripHTML(result.example)}
          </div>
        `
            : ""
        }
        <div class="mt-4 flex items-center text-blue-600 text-sm">
          <span>View details</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    `
    )
    .join("");

  searchResultsGrid.innerHTML = resultsHTML;
}

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// ✅ Event delegation: handle all .search-result clicks
document.addEventListener("click", function (e) {
  const target = e.target.closest(".search-result");
  if (target && target.dataset.slug) {
    searchResults.classList.add("hidden");
    window.location.href = `/?word=${target.dataset.slug}`;
  }
});
