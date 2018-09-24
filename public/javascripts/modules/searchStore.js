import axios from 'axios';
import _ from 'lodash';

const searchResults = document.querySelector('.search__results');

const searchResultHTML = (stores) =>
  stores.map(store => `
    <a href="/stores/${store.slug}" class="search__result"><strong>${store.name}</strong></a>
  `).join('');

const debouncedSearch = _.debounce((query) => {
  axios.get(`/api/stores/search?query=${query}`)
    .then(({ data }) => {

      // Display search results
      if (data.length > 0) {
        searchResults.innerHTML = searchResultHTML(data);
      } else {
        searchResults.innerHTML = `<div class="search__result">No results found for <em>${query}</em></div>`
      }
      searchResults.style.display = 'block';
    })
    .catch(err => {
      console.log(err);
    })
}, 300);

export default function(input) {
  if (!input) return;
  
  let query = '';
  
  input.addEventListener('input', function(e) {
    query = e.target.value;

    if (query !== '') {
      debouncedSearch(query);
    } else {
      searchResults.style.display = 'none';
    }
  })

  const KEYS = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    enter: 'Enter'
  }

  // Handle selection of result via up and down arrow
  input.addEventListener('keyup', function (e) {
    e.preventDefault();

    const searchResult = searchResults.children;
    if (searchResult.length === 0) return;

    const key = e.key || e.keyCode;
    if (Object.keys(KEYS).map(key => KEYS[key]).indexOf(key) === -1) return;

    const selected = document.querySelector('.search__result--active');
    const selectedIndex = Array.prototype.indexOf.call(searchResult, selected);

    // Clear the active class
    Array.prototype.forEach.call(searchResult, result => {
      result.className = 'search__result';
    })
    
    // Set the active class
    if (key === KEYS.up) {
      if (!selected || selectedIndex === 0) {
        searchResult[searchResult.length-1].className = 'search__result search__result--active';
      } else {
        searchResult[selectedIndex - 1].className = 'search__result search__result--active';
      }
    } else if (key === KEYS.down) {
      if (!selected || selectedIndex === searchResult.length - 1) {
        searchResult[0].className = 'search__result search__result--active';
      } else {
        searchResult[selectedIndex + 1].className = 'search__result search__result--active';
      }
    }

    if (key === KEYS.enter) {
      window.location = searchResult[selectedIndex].href;
    }
  })
}