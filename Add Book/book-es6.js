class Book{
  constructor(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}}

class UI{

showMessage(message, className){
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(message));
  div.className = `alert ${className}`;
  const container = document.querySelector('.container'),
        form = document.querySelector('.book-form');
  container.insertBefore(div, form);
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000)
}

clearFields(){
  document.querySelector('.book-title-input').value = '';
  document.querySelector('.author-input').value = '';
  document.querySelector('.isbn-input').value = '';
}

addBookToList(book){
  const list = document.querySelector('.book-list');
  let row = document.createElement('tr');
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href='#' class='remove'>X</a></td>
  `;
  list.appendChild(row);
}
}

class Store {
static getBooks(){
  let books;
  if(localStorage.getItem('books') === null){
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
}
static displayBooks(){
  const books = Store.getBooks();
  books.forEach(function(book){
    const ui = new UI;
    ui.addBookToList(book);
  })
}
static addBooks(book){
  const books = Store.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));

}
static removeBook(isbn){
  const books = Store.getBooks();
  books.forEach(function(book, index){
    if(book.isbn === isbn){
      books.splice(index, 1);
    }
  })
  localStorage.setItem('books', JSON.stringify(books))
}
}
document.addEventListener('DOMContentLoaded', Store.displayBooks)

document.querySelector('.container').addEventListener('submit', function(e){
  const title = document.querySelector('.book-title-input').value,
        author = document.querySelector('.author-input').value,
        isbn = document.querySelector('.isbn-input').value;
  let book = new Book(title, author, isbn);
  let ui = new UI();
if(title === '' || author === '' || isbn === ''){
  ui.showMessage('please add a Book!', 'error');
} else {
  ui.showMessage('Book added', 'success');
  ui.addBookToList(book);
  Store.addBooks(book);
  ui.clearFields();
}


  e.preventDefault();
})

document.querySelector('.book-list').addEventListener('click', function(e){
  if(e.target.className === 'remove'){
    e.target.parentElement.parentElement.remove();
    const ui = new UI();
    ui.showMessage('Book removed', 'success');
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  }
  e.preventDefault();
})