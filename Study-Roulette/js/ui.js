function renderBooks(list){
const wrap=document.getElementById('books');wrap.innerHTML='';
let total=0;
list.forEach((b,bi)=>{
 total+=b.chapters.length;
 const card=document.createElement('div');card.className='book-card';
 card.innerHTML=`<h3>${b.name}<span><button class='edit'>✏️</button><button class='del'>🗑️</button></span></h3>
 <div class='small'>${b.chapters.length} Chapters</div><ul></ul>`;
 const ul=card.querySelector('ul');
 b.chapters.forEach((c,ci)=>{
   const li=document.createElement('li');
   li.innerHTML=`${c} <button class='ec'>✏️</button> <button class='dc'>❌</button>`;
   li.querySelector('.dc').onclick=()=>{books[bi].chapters.splice(ci,1);saveBooks(books);refresh();}
   li.querySelector('.ec').onclick=()=>{let n=prompt('Edit chapter',c);if(n){books[bi].chapters[ci]=n;saveBooks(books);refresh();}}
   ul.appendChild(li);
 });
 card.querySelector('.del').onclick=()=>{books.splice(bi,1);saveBooks(books);refresh();}
 card.querySelector('.edit').onclick=()=>{let n=prompt('Edit book',b.name);if(n){books[bi].name=n;saveBooks(books);refresh();}}
 wrap.appendChild(card);
});
bookCount.textContent=list.length+' Books';
chapterCount.textContent=total+' Chapters';
}
function refresh(){
 const q=searchInput.value.toLowerCase();
 if(!q){renderBooks(books);return;}
 renderBooks(books.filter(b=>b.name.toLowerCase().includes(q)||b.chapters.some(c=>c.toLowerCase().includes(q))));
}
