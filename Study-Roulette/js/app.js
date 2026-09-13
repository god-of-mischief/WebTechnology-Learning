let books=loadBooks();
refresh();
addChapterBtn.onclick=()=>{let i=document.createElement('input');i.className='chapterInput';i.placeholder='Chapter Name';chapterContainer.appendChild(i);}
saveBookBtn.onclick=()=>{
 const name=bookName.value.trim(); if(!name)return alert('Enter book');
 const ch=[...document.querySelectorAll('.chapterInput')].map(x=>x.value.trim()).filter(Boolean);
 if(!ch.length)return alert('Enter chapter');
 books.push({name,chapters:ch}); saveBooks(books);
 bookName.value=''; chapterContainer.innerHTML='<input class="chapterInput" placeholder="Chapter Name">';
 refresh();
}
searchInput.oninput=refresh;
pickBtn.onclick=()=>{
 if(!books.length)return alert('No books');
 const valid=books.filter(b=>b.chapters.length);
 if(!valid.length)return alert('No chapters');
 const b=valid[Math.floor(Math.random()*valid.length)];
 const c=b.chapters[Math.floor(Math.random()*b.chapters.length)];
 alert('📚 '+b.name+'\n\n📖 '+c);
}
