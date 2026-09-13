const KEY='studyRouletteBooks';
function saveBooks(b){localStorage.setItem(KEY,JSON.stringify(b))}
function loadBooks(){return JSON.parse(localStorage.getItem(KEY)||'[]')}