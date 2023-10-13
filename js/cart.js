document.addEventListener('DOMContentLoaded', function () {
    const articlesContainer = document.getElementById('articles'); // Elemento donde se verán los productos

    // Crea un div para el total
    const totalContainer = document.createElement('div');
    totalContainer.id = 'total-container';
    articlesContainer.parentNode.insertBefore(totalContainer, articlesContainer.nextSibling); // Inserta el div después de articlesContainer

    // Recupera los productos del localStorage
    const productosAgregados = JSON.parse(localStorage.getItem('productosAgregados')) || [];
    const productosComprados = JSON.parse(localStorage.getItem('productosComprados')) || [];

    // Función con la estructura para mostrar los productos en el carrito
    function mostrarProductoEnCarrito(product) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <div class="d-flex">
                    <img src="${product.image}" alt="Imagen del producto" class="img-carrito img-fluid mr-3">
                </div>
            </td>
            <td>
                <h4 class="mb-1">${product.name}</h4>
            </td>
            <td>
                <h5 class="mb-1">Precio</h5>
                <p class="precio" data-cost="${product.cost || product.unitCost}" data-currency="${product.currency}" class="mb-0">${product.currency}${product.cost || product.unitCost}</p>
            </td>
            <td>
                <h5>Cantidad</h5>
                <input type="number" class="form-control cantidad" value="1" min="1" style="max-width:80px">
            </td>
            <td>
                <h5 class="mb-1">Subtotal</h5>
                <p class="subtotal" class="mb-0">0.00</p>
            </td>
        `;
        articlesContainer.appendChild(newRow);

        // Evento para la cantidad
        const cantidadInput = newRow.querySelector('.cantidad');
        cantidadInput.addEventListener('input', updateSubtotal);

        // Llama a updateSubtotal para establecer el subtotal inicial
        updateSubtotal({ target: cantidadInput });
    }

    // Función para actualizar el subtotal
    function updateSubtotal(event) {
       const cantidadInput = event.target;
       const row = cantidadInput.closest('tr');
       const precioElement = row.querySelector('.precio');
       const subtotalElement = row.querySelector('.subtotal');

       const cantidad = parseInt(cantidadInput.value);
       const precio = parseFloat(precioElement.dataset.cost);
       const currency = precioElement.dataset.currency; // Corrección en esta línea
       const nuevoSubtotal = cantidad * precio;
       subtotalElement.textContent = `${currency}${nuevoSubtotal.toFixed(1)}`;

    // Después de actualizar el subtotal, se actualiza el total
    actualizarTotal();
}

    // Función para actualizar el total del carrito
    function actualizarTotal() {
        const subtotales = document.querySelectorAll('.subtotal');
        let total = 0;
        subtotales.forEach(subtotal => {
            total += parseFloat(subtotal.textContent.replace(/\D/g, ''));
        });

        // Elimina el elemento anterior si existe
        const existingTotalElement = totalContainer.querySelector('.total');
        if (existingTotalElement) {
            totalContainer.removeChild(existingTotalElement);
        }

        // Crea el elemento para mostrar el total
        const totalElement = document.createElement('h5');
        totalElement.textContent = `Total: U$S${total.toFixed(1)}`;
        totalElement.classList.add('total');

        // Agrega el elemento del total al nuevo contenedor
        totalContainer.appendChild(totalElement);
    }

    // Función para mostrar los productos en el carrito
    function mostrarProductosEnCarrito() {
        // Mostrar el producto predeterminado del usuario "25801"
        const productoUsuario25801 = productosAgregados.find(product => product.userID === "25801");
        if (productoUsuario25801) {
            mostrarProductoEnCarrito(productoUsuario25801);
        }

        // Mostrar los otros productos en el carrito
        productosAgregados.forEach(product => {
            if (product.userID !== "25801") {
                mostrarProductoEnCarrito(product);
            }
        });

        // Mostrar productos comprados
        productosComprados.forEach(product => {
            mostrarProductoEnCarrito(product);
        });

        // Llamar a actualizarTotal para mostrar el total inicial
        actualizarTotal();
    }

    // Obtener producto "25801" desde la API
    const userID = "25801";
    fetch("https://japceibal.github.io/emercado-api/user_cart/" + userID + '.json')
        .then(response => response.json())
        .then(data => {
            const article = data.articles[0];
            mostrarProductoEnCarrito(article);
            mostrarProductosEnCarrito();

            // Agrega un botón para vaciar el carrito
            const vaciarCarritoButton = document.createElement('button');
            vaciarCarritoButton.textContent = 'Vaciar Carrito';
            vaciarCarritoButton.addEventListener('click', vaciarCarrito);
            articlesContainer.appendChild(vaciarCarritoButton); 

        })
        .catch(error => console.error('Error:', error));

    // Función para vaciar el carrito
    function vaciarCarrito() {
        // Vacia el contenido de localStorage
        localStorage.removeItem('productosAgregados');
        localStorage.removeItem('productosComprados');
        // Limpia las filas en el carrito
        articlesContainer.innerHTML = '';
        // Actualiza el total a cero
        actualizarTotal();
    }
});
