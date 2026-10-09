let dictionaryData = [];

// Load and parse the CSV file
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
const resultsDiv = document.getElementById('results');
const definitionCard = document.getElementById('definitionCard');
const cardTitle = document.getElementById('cardTitle');
const cardDescription = document.getElementById('cardDescription');

searchInput.addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();
  resultsDiv.innerHTML = '';
  definitionCard.style.display = 'none';

  if (!query) return;

  // Filter words that start with the input text
  const matches = dictionaryData.filter(item => 
    item.word && item.word.toLowerCase().startsWith(query)
  ).slice(0, 15); // Show top 15 matches

  matches.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    const homonymText = item.homonym_nr ? `(#${item.homonym_nr})` : '';
    div.innerHTML = `<strong>${item.word}</strong> <span class="homonym">${homonymText}</span>`;
    
    div.onclick = () => {
      cardTitle.textContent = `${item.word} ${homonymText}`;
      cardDescription.textContent = item.meaning || 'No description available.';
      definitionCard.style.display = 'block';
      resultsDiv.innerHTML = '';
      searchInput.value = item.word;
    };

    resultsDiv.appendChild(div);
  });
});