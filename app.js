let dictionaryData = [];

// Load and parse CSV
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
const resultsList = document.getElementById('resultsList');
const cardsContainer = document.getElementById('cardsContainer');

// Trigger search on click or pressing Enter
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  resultsList.innerHTML = '';
  cardsContainer.innerHTML = '';

  if (!query) return;

  // Filter items matching the query prefix
  const matches = dictionaryData.filter(item => 
    item.word && item.word.toLowerCase().startsWith(query)
  );

  if (matches.length === 0) {
    resultsList.innerHTML = '<div class="no-results">No words found.</div>';
    return;
  }

  // Group matches by unique lowercased word
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

  // Display top 15 grouped results in the list
  const keys = Object.keys(grouped).slice(0, 15);

  keys.forEach(key => {
    const group = grouped[key];
    const firstMeaning = group.entries[0].meaning || 'No description';
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

    // Clicking a word displays all of its homonym cards underneath
    div.onclick = () => {
      displayWordCards(group);
      resultsList.innerHTML = ''; // Hide search list once word is selected
    };

    resultsList.appendChild(div);
  });
}

function displayWordCards(group) {
  cardsContainer.innerHTML = '';

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