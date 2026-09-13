const booksEl = document.getElementById('books');
const form = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookTitle');
const chapterInput = document.getElementById('chapterInput');
const pickBtn = document.getElementById('pickBtn');
const overlay = document.getElementById('overlay');
const reelText = document.getElementById('reelText');
const result = document.getElementById('result');

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

function render(books) {
  booksEl.innerHTML = books.map(book => `
    <article class="book">
      <h3>${book.title}</h3>
      <div class="chapters">
        ${(book.chapters || []).map((c, i) => `
          <span class="chip">
            ${c}
            <button data-book="${book._id}" data-index="${i}">×</button>
          </span>
        `).join('')}
      </div>
      <button data-delbook="${book._id}">Delete book</button>
    </article>
  `).join('');
}

async function loadBooks() {
  render(await api('/api/books'));
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const chapters = chapterInput.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  await api('/api/books', {
    method: 'POST',
    body: JSON.stringify({
      title: bookTitle.value,
      chapters
    })
  });

  bookTitle.value = '';
  chapterInput.value = '';
  loadBooks();
});

booksEl.addEventListener('click', async e => {
  if (e.target.dataset.delbook) {
    await api(`/api/books/${e.target.dataset.delbook}`, { method: 'DELETE' });
    loadBooks();
  }

  if (e.target.dataset.book) {
    await api(`/api/books/${e.target.dataset.book}/chapters/${e.target.dataset.index}`, {
      method: 'DELETE'
    });
    loadBooks();
  }
});

pickBtn.addEventListener('click', async () => {
  overlay.classList.remove('hidden');
  result.classList.add('hidden');

  const frames = ['Loading destiny...', 'Spinning chapters...', 'Almost there...', 'Locking in...'];
  let i = 0;
  reelText.textContent = frames[0];

  const timer = setInterval(() => {
    reelText.textContent = frames[i++ % frames.length];
  }, 180);

  setTimeout(async () => {
    clearInterval(timer);
    try {
      const pick = await api('/api/random-pick');
      overlay.classList.add('hidden');
      result.classList.remove('hidden');
      result.textContent = `${pick.bookTitle} → ${pick.chapter}`;
    } catch (err) {
      overlay.classList.add('hidden');
      alert(err.message);
    }
  }, 1800);
});

overlay.addEventListener('click', e => {
  if (e.target === overlay) overlay.classList.add('hidden');
});

loadBooks();