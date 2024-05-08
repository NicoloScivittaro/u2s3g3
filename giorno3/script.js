
// Funzione per ottenere i dati dei libri dall'API
function fetchBooks() {
    return fetch('https://striveschool-api.herokuapp.com/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nel recupero dei libri');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Errore nel recupero dei libri:', error);
      });
  }
  

// Funzione per creare una card per un libro
function createBookCard(book) {
  const card = document.createElement('div');
  card.classList.add('col');
  card.innerHTML = `
    <div class="card h-100">
      <img src="${book.img}" class="card-img-top" alt="${book.title}">
      <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">${book.price} €</p>
        <button class="btn btn-danger remove-btn">Scarta</button>
        <button class="btn btn-primary add-to-cart-btn">Aggiungi al carrello</button>
      </div>
    </div>
  `;
  return card;
}

// Funzione per aggiungere un libro al carrello
function addToCart(book) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(book);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Funzione per rimuovere un libro dal carrello
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Funzione per visualizzare il carrello
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cart');
  cartList.innerHTML = '';
  cart.forEach((book, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
      <span>${book.title}</span>
      <button class="btn btn-danger remove-from-cart-btn" data-index="${index}">Rimuovi</button>
    `;
    cartList.appendChild(listItem);
  });
}

// Carica i libri quando la pagina è pronta
document.addEventListener('DOMContentLoaded', async () => {
  const books = await fetchBooks();
  const booksContainer = document.getElementById('books-container');
  books.forEach(book => {
    const card = createBookCard(book);
    booksContainer.appendChild(card);
  });

  // Gestisci il click sul pulsante "Scarta"
  booksContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      event.target.closest('.col').remove();
    }
  });

  // Gestisci il click sul pulsante "Aggiungi al carrello"
  booksContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
      const book = event.target.closest('.card').querySelector('.card-title').textContent;
      addToCart(book);
    }
  });

  // Gestisci il click sul pulsante "Rimuovi" nel carrello
  document.getElementById('cart').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
      const index = event.target.dataset.index;
      removeFromCart(index);
    }
  });

  // Carica il carrello quando la pagina è pronta
  renderCart();
});
