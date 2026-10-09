let dictionaryData = [];

// Load CSV file
Papa.parse('dictionary.csv', {
  download: true,
  header: true,
  delimiter: ';',
  skipEmptyLines: true,
  complete: function(results) {
    dictionaryData = results.data.filter(item => item.word);
  }
});

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const dropdown = document.getElementById('dropdown');
const resultsList = document.getElementById('resultsList');
const cardsContainer = document.getElementById('cardsContainer');

// Live Typing: Temporary dropdown preview
searchInput.addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();
  dropdown.innerHTML = '';

  if (!query) {
    dropdown.style.display = 'none';
    return;
  }

  const matches = getGroupedMatches(query);
  const keys = Object.keys(matches).slice(0, 8); // Top 8 dropdown suggestions

  if (keys.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  keys.forEach(key => {
    const group = matches[key];
    const div = document.createElement('div');
    div.className = 'dropdown-item';
    
    const countText = group.entries.length > 1 ? `<span class="badge">${group.entries.length}</span>` : '';
    div.innerHTML = `<span>${group.displayName}</span> ${countText}`;

    div.onclick = () => {
      searchInput.value = group.displayName;
      dropdown.style.display = 'none';
      displayWordCards(group);
      resultsList.innerHTML = '';
    };

    dropdown.appendChild(div);
  });

  dropdown.style.display = 'block';
});

// Press Enter or Search Button: Full results list with previews
searchBtn.addEventListener('click', executeSearch);
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    executeSearch();
  }
});

// Refresh / Reset Button
refreshBtn.addEventListener('click', resetAll);

function executeSearch() {
  dropdown.style.display = 'none';
  resultsList.innerHTML = '';
  cardsContainer.innerHTML = '';

  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  const matches = getGroupedMatches(query);
  const keys = Object.keys(matches);

  if (keys.length === 0) {
    show404Error();
    return;
  }

  // Display full search results list with previews
  keys.slice(0, 20).forEach(key => {
    const group = matches[key];
    const firstMeaning = group.entries[0].meaning || 'No description available.';
    const count = group.entries.length;

    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      <div class="result-title">
        <span>${group.displayName}</span>
        ${count > 1 ? `<span class="badge">${count} meanings</span>` : ''}
      </div>
      <div class="result-preview">${firstMeaning}</div>
    `;

    div.onclick = () => {
      displayWordCards(group);
      resultsList.innerHTML = '';
    };

    resultsList.appendChild(div);
  });
}

function displayWordCards(group) {
  cardsContainer.innerHTML = '';
  resultsList.innerHTML = '';

  group.entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'card';

    const homonymLabel = entry.homonym_nr ? `<span class="homonym-badge">#${entry.homonym_nr}</span>` : '';

    card.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">${entry.word}</h2>
        ${homonymLabel}
      </div>
      <div class="card-body">${entry.meaning || 'No description available.'}</div>
    `;

    cardsContainer.appendChild(card);
  });
}

function show404Error() {
  cardsContainer.innerHTML = `
    <div class="error-container">
      <img src="404.jpg" alt="404 Word Not Found" class="error-image" />
      <p class="error-text">Zijn we weer woorden aan't verzinnen, ja?</p>
    </div>
  `;
}

function resetAll() {
  searchInput.value = '';
  dropdown.style.display = 'none';
  dropdown.innerHTML = '';
  resultsList.innerHTML = '';
  cardsContainer.innerHTML = '';
  searchInput.focus();
}

function getGroupedMatches(query) {
  const matches = dictionaryData.filter(item => 
    item.word && item.word.toLowerCase().startsWith(query)
  );

  const grouped = {};
  matches.forEach(item => {
    const key = item.word.toLowerCase();
    if (!grouped[key]) {
      grouped[key] = {
        displayName: item.word,
        entries: []
      };
    }
    grouped[key].entries.push(item);
  });

  return grouped;
}

// Hide dropdown when clicking outside search area
document.addEventListener('click', function(e) {
  if (!e.target.closest('.search-container')) {
    dropdown.style.display = 'none';
  }
});
