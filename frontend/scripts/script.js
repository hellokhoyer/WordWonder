function setupAudioPlayer(audioUrl) {
  const player = document.getElementById("audioPlayer");
  player.src = audioUrl;
  player.load();
  player.play();

  const pronounceBtn = document.getElementById("pronounce");
  pronounceBtn.textContent = "Pronouncing...";

  player.onplaying = () => {
    pronounceBtn.classList.remove("player-ready");
    pronounceBtn.classList.add("player-playing");
  };

  player.onended = () => {
    pronounceBtn.classList.remove("player-playing");
    pronounceBtn.classList.add("player-ready");
    pronounceBtn.textContent = "Pronounce";
  };
}

async function setupAudio(word) {
  try {
    const response = await fetch(`/api/pronunciation/${word}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0 && data[0].fileUrl) {
      setupAudioPlayer(data[0].fileUrl);
    } else {
      alert("Pronunciation not available for this word.");
    }
  } catch (error) {
    console.error("Error fetching audio:", error);
    alert("Error fetching pronunciation. Please try again later.");
  }
}

function updateWordContent(wordData) {
  const word = wordData.front[0].content;
  const definition = wordData.back[1].content;
  const sentence = wordData.back[2].content;

  document.getElementById("word").textContent = word;
  document.getElementById("definition").innerHTML = definition;
  document.getElementById("sentence").innerHTML = sentence;

  fetchSynonymsAndAntonyms(word);

  document.getElementById("pronounce").dataset.word = word;
  document.querySelector(".loading").style.display = "none";
}

async function fetchSynonymsAndAntonyms(word) {
  try {
    const synonymsResponse = await fetch(
      `/api/related-words/${word}?type=synonym`
    );
    const synonymsData = await synonymsResponse.json();

    const synonymsList = document.getElementById("synonyms-list");
    synonymsList.innerHTML = "";

    if (synonymsData[0] && synonymsData[0].words) {
      synonymsData[0].words.forEach((synonym) => {
        const listItem = document.createElement("li");
        listItem.className =
          "bg-blue-50 px-3 py-2 rounded-md text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer";
        listItem.textContent = synonym;
        synonymsList.appendChild(listItem);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.className =
        "bg-gray-50 px-3 py-2 rounded-md text-gray-500 italic";
      listItem.textContent = "No synonyms available.";
      synonymsList.appendChild(listItem);
    }

    const antonymsResponse = await fetch(
      `/api/related-words/${word}?type=antonym`
    );
    const antonymsData = await antonymsResponse.json();

    const antonymsList = document.getElementById("antonyms-list");
    antonymsList.innerHTML = "";

    if (antonymsData[0] && antonymsData[0].words) {
      antonymsData[0].words.forEach((antonym) => {
        const listItem = document.createElement("li");
        listItem.className =
          "bg-red-50 px-3 py-2 rounded-md text-red-800 hover:bg-red-100 transition-colors cursor-pointer";
        listItem.textContent = antonym;
        antonymsList.appendChild(listItem);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.className =
        "bg-gray-50 px-3 py-2 rounded-md text-gray-500 italic";
      listItem.textContent = "No antonyms available.";
      antonymsList.appendChild(listItem);
    }
  } catch (error) {
    console.error("Error fetching related words:", error);
  }
}

document.getElementById("refresh-word").addEventListener("click", function () {
  document.querySelector(".loading").style.display = "block";
  document.getElementById("word").textContent = "";

  document.getElementById("definition").textContent = "";
  document.getElementById("sentence").textContent = "";
  document.getElementById("synonyms-list").innerHTML = "";
  document.getElementById("antonyms-list").innerHTML = "";

  loadWordData();
});

async function loadWordData() {
  try {
    const response = await fetch("/api/random-word");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const wordData = await response.json();
    updateWordContent(wordData);
  } catch (error) {
    console.error("Error loading word data:", error);
    alert("Error loading word data. Please try again later.");
  }
}

document.getElementById("pronounce").addEventListener("click", function () {
  const word = this.dataset.word;
  if (navigator.onLine) {
    setupAudio(word);
  } else {
    alert("Pronunciation requires an internet connection.");
  }
});

let searchTimeout;
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function () {
  const query = this.value.trim();

  clearTimeout(searchTimeout);

  if (query.length < 2) {
    searchResults.classList.add("hidden");
    return;
  }

  searchTimeout = setTimeout(() => {
    performSearch(query);
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
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  }
});

async function performSearch(query) {
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&limit=5`
    );
    const results = await response.json();

    displaySearchResults(results, query);
  } catch (error) {
    console.error("Search error:", error);
  }
}

function displaySearchResults(results, query) {
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        <p>No results found for "${query}"</p>
        <p class="text-sm mt-1">Press Enter to see more results</p>
      </div>
    `;
  } else {
    const resultsHTML = results
      .map(
        (result) => `
      <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
           onclick="loadWordBySlug('${result.slug}')">
        <div class="font-semibold text-gray-800">${result.word}</div>
        <div class="text-sm text-gray-600 mt-1">${stripHTML(
          result.definition
        )}</div>
      </div>
    `
      )
      .join("");

    searchResults.innerHTML =
      resultsHTML +
      `
      <div class="p-3 text-center border-t border-gray-200 bg-gray-50">
        <button class="text-blue-600 text-sm hover:text-blue-800"
                onclick="window.location.href='/search?q=${encodeURIComponent(
                  query
                )}'">
          View all results for "${query}"
        </button>
      </div>
    `;
  }

  searchResults.classList.remove("hidden");
}

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

async function loadWordBySlug(slug) {
  try {
    searchResults.classList.add("hidden");
    searchInput.value = "";

    const response = await fetch(`/api/word/${slug}`);
    const wordData = await response.json();

    updateWordContent(wordData);
  } catch (error) {
    console.error("Error loading word:", error);
  }
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const wordSlug = urlParams.get("word");

  if (wordSlug) {
    loadWordBySlug(wordSlug);
    window.history.replaceState({}, "", "/");
  } else {
    loadWordData();
  }
};
