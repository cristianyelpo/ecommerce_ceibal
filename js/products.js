document.addEventListener("DOMContentLoaded", function () {
  const catID = localStorage.getItem("catID");
  const DATA_URL =

  `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; // Nueva URL que contiene los datos que queremos mostrar

  const container = document.getElementById("container"); // "Traemos" utilizando el DOM el div de id "container" para colocar la información en él
  let productos_sin_filtro;




  /**
   * Función que recibe por parámetro un array con los datos que se mostrarán en el DOM
   * Los datos se mostrarán dentro del div de id "container" y por cada ítem se está creando un nuevo div que contiene información del producto
   */
  function showProducts(productArray) {
    for (const product of productArray) {
      const productDiv = document.createElement("div"); // Crear un nuevo div para mostrar información del producto
      productDiv.classList.add("product"); // Agregar una clase al div para aplicar estilos si es necesario

      productDiv.innerHTML = `
      <div class="list-group-item list-group-item-action cursor-active">
      <div class="row">
          <div class="col-3">
              <img src="${product.image}" alt="${product.name}" class="img-thumbnail" />
          </div>
          <div class="col">
              <div class="row">
                  <div class="col">
                      <h3 class="product-name">
              ${product.name} ${product.currency} ${product.cost}
                      </h3>
                  </div>
              </div>
              <div class="row">
                  <div class="col">
                      <p class="product-description">${product.description}</p>
                  </div>
              </div>
              <div class="row">
                  <div class="col">
                      <p class="product-sold-count">Vendidos: ${product.soldCount}</p>
                  </div>
              </div>
          </div>
      </div>
  </div>
`;

      container.appendChild(productDiv); // Agregar el nuevo div del producto al contenedor
    }
  }

  // Cargar el JSON
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      
      productos_sin_filtro = data.products.slice();

      container.innerHTML = ""; // Limpiar el contenido actual del contenedor
      showProducts(productos_sin_filtro); // Mostrar los productos
    });


//Ordenar por relevancia
  function ordenar_y_mostrar_productos(orden){
  fetch(DATA_URL)
  .then((response) => response.json())
  .then((data) => {
    var products= data.products;
    if(orden === "soldCount"){
      products.sort((a,b) => b.soldCount - a.soldCount);
    }
    container.innerHTML="";
    showProducts(products);
  }

  )};

// Ordenar por precio
function ordenarPorPrecio(orden) {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      var products = data.products;
      if (orden === "asc") {
        products.sort((a, b) => a.cost - b.cost);
      } else if (orden === "desc") {
        products.sort((a, b) => b.cost - a.cost);
      }
      container.innerHTML = "";
      showProducts(products);
    });
}

//Filtrar por rango de precios
function filtrarPorRangoDePrecio(min, max) {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      var products = data.products;
      products = products.filter((product) => product.cost >= min && product.cost <= max);
      container.innerHTML = "";
      showProducts(products);
    });
}

//Buscador
function buscarProductos(buscador) {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      var products = data.products;
      if (buscador) {
        products = products.filter((product) =>
          product.name.toLowerCase().includes(buscador) ||
          product.description.toLowerCase().includes(buscador)
        );
      }
      container.innerHTML = "";
      showProducts(products);
    });
}

//Evento para buscar por nombre y descripcíon
document.getElementById("searchBox").addEventListener("input", function () {
  let buscador = this.value.toLowerCase();
  buscarProductos(buscador);
});


//Evento para ordenar por relevancia
  const ORDER_BY_PROD_COUNT = "Cant.";
  document.getElementById("sortByCount").addEventListener("click", function(){
  ordenar_y_mostrar_productos("soldCount");

  });

//Evento para ordenar por precio ascendente
document.getElementById("sortAsc").addEventListener("click", function () {
  ordenarPorPrecio("asc");
});

// Evento para ordenar por precio descendente
document.getElementById("sortDesc").addEventListener("click", function () {
  ordenarPorPrecio("desc");
});

//Evento para filtrar por rango de precios
  document.getElementById("rangeFilterCount").addEventListener("click", function () {
    let min = document.getElementById("rangeFilterCountMin").value;
    let max = document.getElementById("rangeFilterCountMax").value;
    filtrarPorRangoDePrecio(min, max);
  });

//Evento para limpiar el filtro
  document.getElementById("clearRangeFilter").addEventListener("click", function(){
    container.innerHTML="";
    showProducts(productos_sin_filtro);
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
  });

});


























