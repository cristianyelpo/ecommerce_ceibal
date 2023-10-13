
// Obtener el identificador de localStorage
var productId = localStorage.getItem('selectedProduct');
var catID = localStorage.getItem('catID');

// Función para obtener los datos
function fetchData(catID) {
    return fetch('https://japceibal.github.io/emercado-api/cats_products/' + catID + '.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Error HTTP: " + response.status);
        }
        return response.json();
      });
  }
  
  // Función para buscar el producto por id
  function findProduct(data, productId) {
    return data.products.find(product => Number(product.id) === Number(productId));
  }
  
  // Función para mostrar la información del producto
  function showProductInfo(product) {
    var productInfoDiv = document.getElementById('productInfo');
    productInfoDiv.innerHTML = `
      <div class="productogeneral">
        <div class="productocompleto"> 
        </div>
        <div class="productocompleto2">
          <img id="logodeecomerceenproductos" src="img/login.png" alt="logoecomerce" />
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>Precio: ${product.currency} ${product.cost}</p>
          <p>Vendidos: ${product.soldCount}</p>
          <button id="botoncompra" >Comprar ahora</button> <br>
          <button id="botoncarro" >Agregar al carrito</button>
        </div>

      </div>
      <div class="imgchiquitas">
        <img src="img/prod${product.id}_1.jpg" alt="${product.name}" />
        <img src="img/prod${product.id}_2.jpg" alt="${product.name}" />
        <img src="img/prod${product.id}_3.jpg" alt="${product.name}" />
        <img src="img/prod${product.id}_4.jpg" alt="${product.name}" />
      </div>
    `;
    // Event listener para el botón "Comprar ahora"
var botonCompra = document.getElementById('botoncompra');
botonCompra.addEventListener('click', function () {
    // Guardar información del producto en el Local Storage
    var productosComprados = JSON.parse(localStorage.getItem('productosComprados')) || [];
    productosComprados.push(product);
    localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
    window.location.href = 'cart.html'; // Redirigir al carrito
});

// Agregar un evento click al botón "Agregar al carrito"
var botonCarro = document.getElementById('botoncarro');
botonCarro.addEventListener('click', function () {
    // Guardar información del producto en el Local Storage
    var productosAgregados = JSON.parse(localStorage.getItem('productosAgregados')) || [];
    productosAgregados.push(product);
    localStorage.setItem('productosAgregados', JSON.stringify(productosAgregados));
    alert('Producto agregado al carrito.');
});
}
  
  
  // Función para obtener los productos relacionados por categoría
  function getRelatedProducts(data, product) {
    return data.products.filter(p => p.category === product.category && p.id !== product.id);
  }
  
  // Función para manejar el clic en un producto relacionado
  function relatedProductClick(relatedProduct) {
    localStorage.setItem('selectedProduct', relatedProduct.id);
    window.location.href = 'product-info.html';
  }
  
  // Función para mostrar los productos relacionados
  function showRelatedProducts(relatedProducts) {
    var relatedProductsContainer = document.querySelector('.related-product-list');
    relatedProducts.forEach(relatedProduct => {
      var relatedProductElement = document.createElement('div');
      relatedProductElement.classList.add('related-product');
      relatedProductElement.innerHTML = `
        <img src="img/prod${relatedProduct.id}_1.jpg" alt="${relatedProduct.name}" />
        <h3>${relatedProduct.name}</h3>
      `;

    // Evento de clic para manejar la selección del producto relacionado
      relatedProductElement.addEventListener('click', () => relatedProductClick(relatedProduct));
      relatedProductsContainer.appendChild(relatedProductElement);
    });
  }
  
  // Uso de las funciones
  fetchData(catID)
    .then(data => {
      var product = findProduct(data, productId);
      if (product) {
        showProductInfo(product);
        var relatedProducts = getRelatedProducts(data, product);
        showRelatedProducts(relatedProducts);
      }
    })
    .catch(error => console.error("Error: ", error));
  

// Función para obtener y mostrar los comentarios
function fetchAndDisplayComments() {
    const apiUrl = 'https://japceibal.github.io/emercado-api/products_comments/' + productId + '.json';

    fetch(apiUrl)
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.getElementById('comments-list');

            // Limpia la lista de comentarios
            commentsList.innerHTML = ''; 

            
            // Crea un elemento para mostrar cada comentario
            comments.forEach(comment => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                <div class="comentariosgente3">
                <strong>${comment.user} - </strong> ${comment.dateTime} <br>
                <strong>Comentario:</strong> ${comment.description} <br>    
                <div class="rating"> <strong>Puntuación:</strong> ${generateStars(comment.score)}
                </div> 
                </div>  <hr>  
                    
                `;
                // Agrega el comentario a la lista
                commentsList.appendChild(listItem); 
            });
        })
        .catch(error => console.error('Error al obtener los comentarios:', error));
}

// Llamar a la función para obtener y mostrar los comentarios al cargar la página
fetchAndDisplayComments();

// Función para generar las estrellas
function generateStars(score) {
    let starsHtml = '';
    for (let i = 0; i < score; i++) {
        starsHtml += '<span class="fa fa-star checked"></span>';
    }
    return starsHtml;
}

let selectedRating = 0;

// Obtiene todas las estrellas y las almacena en un array
const starElements = Array.from(document.querySelectorAll('.star'));

// Agrega un event listener a cada estrella
starElements.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1; // El índice del array comienza en 0, por lo que sumamos 1
        rate(selectedRating);
    });
});

function rate(rating) {
    selectedRating = rating;
    starElements.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function submitRating() {
    const rating = document.getElementById('rating').value;
    const commentText = document.getElementById('comment-text').value;

    if (!rating || !commentText) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Crea un nuevo comentario
    const newComment = {
        user: sessionStorage.getItem("loggedIn"),
        score: rating, // Aquí no es necesario agregar comillas
        dateTime: new Date().toLocaleString(),
        description: commentText
    };

    // Agrega el nuevo comentario a la lista en la página
    const commentsList = document.getElementById('comments-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <div class="comentariosgente3">
        <strong>${newComment.user} - </strong> ${newComment.dateTime} <br>
        <strong>Comentario:</strong> ${newComment.description} <br>
        <div class="rating"> <strong>Puntuación:</strong> ${generateStars(newComment.score)}
        </div> 
    </div> <hr>
    `;
    commentsList.appendChild(listItem);

    // Limpia los campos del formulario
    document.getElementById('rating').value = '';
    document.getElementById('comment-text').value = '';

    alert('Comentario enviado con éxito!');
}

// Elemento <select>
const selectElement = document.getElementById('rating');

// Evento de cambio en el <select>
selectElement.addEventListener('change', function () {
    // Obtiene el valor seleccionado en el <select>
    const selectedValue = parseInt(selectElement.value);

    // Llama a la función para mostrar las estrellas seleccionadas
    rate(selectedValue);
});

// Ejemplo de uso inicial
rate(selectedRating); // Llama a la función para mostrar las estrellas iniciales



document.addEventListener("DOMContentLoaded", function () {
    const carouselContainer = document.getElementById("carousel");
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    // Obtener la id del producto desde el localStorage
    const productId = localStorage.getItem('selectedProduct');

    // Comprueba si productId es válido (no nulo)
    if (productId) {
        // Obtiene el producto y su información
        const product = {
            id: productId, // Utiliza la id del producto desde localStorage
            name: "Nombre del Producto"
        };

        // Define el número total de imágenes disponibles para el producto
        const totalImages = 4; 

        let currentSlide = 1; // Comienza con la primera imagen

        // Función para mostrar la imagen actual
        function showSlide(index) {
            currentSlide = index;
            const slideHTML = `
                <div class="slide">
                    <img src="img/prod${product.id}_${currentSlide}.jpg" alt="${product.name}" />
                </div>
            `;
            carouselContainer.innerHTML = slideHTML;
        }

        // Función para avanzar a la siguiente imagen
        function nextSlide() {
            currentSlide = (currentSlide % totalImages) + 1; // Ciclo entre las imágenes
            showSlide(currentSlide);
        }

        // Función para retroceder a la imagen anterior
        function prevSlide() {
            currentSlide = ((currentSlide - 2 + totalImages) % totalImages) + 1; // Ciclo en dirección inversa
            showSlide(currentSlide);
        }

        // Muestra la primera imagen al cargar la página
        showSlide(currentSlide);

        // Agrega los eventos para los botones de "Anterior" y "Siguiente"
        prevButton.addEventListener("click", prevSlide);
        nextButton.addEventListener("click", nextSlide);
    } else {
        // Manejar el caso en que no se encuentre la ID del producto en el localStorage
        console.error('No se encontró la ID del producto en el localStorage');
    }
});
