document.addEventListener("DOMContentLoaded", function () {
  const DATA_URL =
    "https://japceibal.github.io/emercado-api/cats_products/101.json"; // Nueva URL que contiene los datos que queremos mostrar

  const container = document.getElementById("container"); // "Traemos" utilizando el DOM el div de id "container" para colocar la información en él

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
      var products = data.products;

      container.innerHTML = ""; // Limpiar el contenido actual del contenedor
      showProducts(products); // Mostrar los productos
    });
});