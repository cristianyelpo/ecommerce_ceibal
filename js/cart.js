document.addEventListener('DOMContentLoaded', function () {
  const articlesContainer = document.getElementById('articles'); // Elemento donde se verán los productos

  // Crea un div para el resumen de la orden
  const orderSummaryContainer = document.createElement('div');
  orderSummaryContainer.id = 'order-summary-container';
  articlesContainer.parentNode.insertBefore(orderSummaryContainer, articlesContainer.nextSibling); // Inserta el div después de articlesContainer

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
          <td>
          <i class="fas fa-trash-alt eliminar-producto" data-product="${product.name}"></i>
          </td>
      `;
      articlesContainer.appendChild(newRow);

      // Evento para actualizar la cantidad 
      const cantidadInput = newRow.querySelector('.cantidad');
      cantidadInput.addEventListener('input', () => {
          actualizarSubtotal({ target: cantidadInput });
          calcularCostoEnvio(); // 
      });

       // Evento para eliminar el producto
    const eliminarProductoIcon = newRow.querySelector('.eliminar-producto');
    eliminarProductoIcon.addEventListener('click', function () {
        const productName = this.getAttribute('data-product');
        eliminarProductoDelCarrito(productName);
        actualizarTotal();
    });

      // Llama a actualizarSubtotal para establecer el subtotal inicial
      actualizarSubtotal({ target: cantidadInput });
  }


    // Función para actualizar el total del carrito
    function actualizarTotal() {
      const subtotales = document.querySelectorAll('.subtotal');
      if (subtotales.length === 0) {
        // Si no hay productos en el carrito, establecer todos los totales a 0
        document.getElementById('subtotal').textContent = 'USD 0';
        document.getElementById('costo-envio').textContent = 'USD 0';
        document.getElementById('total-pagar').textContent = 'USD 0';
        return;
      }
    
      let total = 0;
      subtotales.forEach(subtotal => {
        total += parseInt(subtotal.textContent.replace(/\D/g, ''));
      });
    
      const costoEnvio = parseInt(document.getElementById('costo-envio').textContent.replace(/\D/g, ''));
    
      const totalAPagar = total + costoEnvio;
      const currency = document.querySelector('.precio').dataset.currency;
    
      // Actualizamos los elementos HTML
      document.getElementById('subtotal').textContent = `${currency} ${total}`;
      document.getElementById('costo-envio').textContent = `${currency} ${costoEnvio}`;
      document.getElementById('total-pagar').textContent = `${currency} ${totalAPagar}`;
    }

  // Función para actualizar el subtotal
  function actualizarSubtotal(event) {
    const cantidadInput = event.target;
    const row = cantidadInput.closest('tr');
    const precioElement = row.querySelector('.precio');
    const subtotalElement = row.querySelector('.subtotal');

    const cantidad = parseInt(cantidadInput.value);
    const precio = parseInt(precioElement.dataset.cost);
    const currency = precioElement.dataset.currency;
    
    let nuevoSubtotal;

    if (currency === 'UYU') {
        precio_convertido= cantidad * (precio / 40); // Convertimos a USD
        nuevoSubtotal=Math.round(precio_convertido);
    } else {
        nuevoSubtotal = cantidad * precio;
    }

    subtotalElement.textContent = `USD ${nuevoSubtotal}`;

    // Después de actualizar el subtotal, se actualiza el total
    actualizarTotal();
}


function calcularCostoEnvio() {
  const subtotales = document.querySelectorAll('.subtotal');
  let subtotalGeneral = 0;
  subtotales.forEach(subtotal => {
      subtotalGeneral += parseInt(subtotal.textContent.replace(/\D/g, ''));
  });

  const tipoEnvioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
  const porcentajeEnvioNormal = 5;
  const porcentajeEnvioExpress = 7;
  const porcentajeEnvioPrioritario = 15;
  let costoEnvío = 0;

  if (tipoEnvioSeleccionado) {
      if (tipoEnvioSeleccionado.id === "envioNormal") {
          costoEnvío = parseInt(subtotalGeneral * (porcentajeEnvioNormal / 100));
      } else if (tipoEnvioSeleccionado.id === "envioExpress") {
          costoEnvío = parseInt(subtotalGeneral * (porcentajeEnvioExpress / 100));
      } else if (tipoEnvioSeleccionado.id === "envioPrioritario") {
          costoEnvío = parseInt(subtotalGeneral * (porcentajeEnvioPrioritario / 100));
      }
  }

  const costoEnvioElement = document.getElementById('costo-envio');
  costoEnvioElement.textContent = `USD ${costoEnvío}`;

  actualizarTotal();
}


// Agregar evento de cambio para los tipos de envío
const tipoEnvioRadios = document.querySelectorAll('input[name="tipoEnvio"]');
tipoEnvioRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const errorTipoEnvio = document.getElementById('error-tipoEnvio');
        errorTipoEnvio.textContent = ''; // Limpiar el mensaje de error cuando se seleccione un tipo de envío.
        
        // Cálculo del costo de envío cada vez que se selecciona un tipo de envío.
        calcularCostoEnvio();
      });
    });



  // Función para vaciar el carrito con botón "Vaciar Carrito"
  function vaciarCarrito() {
    // Vacia el contenido de localStorage
    localStorage.removeItem('productosAgregados');
    localStorage.removeItem('productosComprados');
    
    // Limpia las filas
    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = '';

    // Actualiza el total a cero
    actualizarTotal();

    // Actualiza el costo de envío a cero
    
    const costoEnvioElement = document.getElementById('costo-envio');
    costoEnvioElement.textContent = '0';
    const subtot=document.getElementById("subtotal");
    subtot.textContent='0';

    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.id = 'empty-cart-message';
    emptyCartMessage.textContent = 'Aún no hay productos en el carrito.';
    articlesContainer.appendChild(emptyCartMessage);
}


  // Función para eliminar un producto del carrito
  function eliminarProductoDelCarrito(productName) {
    // Eliminar el producto del carrito en el DOM
    const rows = articlesContainer.querySelectorAll('tr');
    for (const row of rows) {
        const productNameInRow = row.querySelector('h4').textContent;
        if (productNameInRow === productName) {
            row.remove();
            break; // Salir después de encontrar y eliminar el producto
        }
    }
  
    // Eliminar el producto del almacenamiento local (productosAgregados y productosComprados)
    let productosAgregados = JSON.parse(localStorage.getItem('productosAgregados')) || [];
    let productosComprados = JSON.parse(localStorage.getItem('productosComprados')) || [];
  
    // Filtrar los productos y eliminar el que coincide con el nombre
    productosAgregados = productosAgregados.filter(product => product.name !== productName);
    productosComprados = productosComprados.filter(product => product.name !== productName);
  
    // También eliminar el producto con userID 50921 si existe
    productosAgregados = productosAgregados.filter(product => product.userID !== "50921");
    productosComprados = productosComprados.filter(product => product.userID !== "50921");
  
    // Actualizar el localStorage
    localStorage.setItem('productosAgregados', JSON.stringify(productosAgregados));
    localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
  
    // Actualizar el total
    actualizarTotal();
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
          vaciarCarritoButton.classList.add('boton-vaciar-carrito');
          articlesContainer.appendChild(vaciarCarritoButton);
      })
      .catch(error => console.error('Error:', error));


// -----------------------------------------------------------------
// PARTE 2 DE LA ENTREGA 6
// -----------------------------------------------------------------

// parte 1
      const openPaymentModalLink = document.getElementById('open-payment-modal-link');
      const paymentModal = document.getElementById('paymentModal');
      const closePaymentModalBtn = document.getElementById('closePaymentModalBtn');
      const paymentMethodRadio = document.getElementsByName('paymentMethod');
      const expirationDateInput = document.getElementById('expirationDate');



// parte 2
openPaymentModalLink.addEventListener('click', (event) => {
  event.preventDefault();
  openPaymentModal();
});

closePaymentModalBtn.addEventListener("click", () => closePaymentModal());

paymentMethodRadio.forEach((radio) => {
  radio.addEventListener('change', togglePaymentFields);
});



// parte 3
function openPaymentModal() {
  paymentModal.style.display = 'block';
}

function closePaymentModal() {
  paymentModal.style.display = 'none';
}



// parte 4
function togglePaymentFields() {
  const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  creditCardFields.style.display = selectedPaymentMethod === 'tarjeta' ? 'block' : 'none';
  bankTransferFields.style.display = selectedPaymentMethod === 'transferencia' ? 'block' : 'none';
  selectedPaymentMethod === 'tarjeta' ? enableCreditCardFields() : disableCreditCardFields();
  selectedPaymentMethod === 'transferencia' ? enableBankTransferFields() : disableBankTransferFields();
}

// -----------------------------------------------------------------
// FIN 2 DE LA ENTREGA 6
// -----------------------------------------------------------------





// -----------------------------------------------------------------
// PARTE 3 DE LA ENTREGA 6
// -----------------------------------------------------------------

const submitPaymentButton = document.getElementById('submitPayment');
submitPaymentButton.addEventListener('click', processPayment);

function processPayment() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const creditCardNumber = document.getElementById('creditCardNumber').value;
  const securityCode = document.getElementById('securityCode').value;
  expirationDate = expirationDateInput.value;

  if (paymentMethod === 'tarjeta' && isNumeric(creditCardNumber) && isNumeric(securityCode)) {
    
  } else if (paymentMethod === 'transferencia' && isNumeric(document.getElementById('accountNumber').value)) {

  } else {
    showErrorAlert();
    return;
  }

  // Cierra el modal de pago
  closePaymentModal();

  // Actualiza el párrafo de método de pago en el carrito
  const paymentMethodDescription = document.getElementById('payment-method-description');
  const selectedPaymentMethod = paymentMethod === 'tarjeta' ? 'Tarjeta de Crédito' : 'Transferencia Bancaria';
  paymentMethodDescription.textContent = selectedPaymentMethod;
}

function isNumeric(value) {
  return /^\d+$/.test(value);
}

function showErrorAlert() {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.textContent = 'La información de pago es incorrecta';
  errorMessageDiv.style.color = 'red';

  // Cambiar el estilo de los campos de entrada (input) con errores
  document.querySelectorAll('input[type="text"]').forEach((field) => {
    field.style.borderColor = 'red';
  });
}

function showSuccessAlert() {
  const successAlert = document.createElement('div');
  successAlert.classList.add('alert', 'alert-success');
  successAlert.textContent = '¡Has comprado con éxito!';
  document.body.appendChild(successAlert);

  setTimeout(() => {
    window.location.href = 'index.html'; // Redirige a index.html después de 2 segundos
  }, 2000);
}

// Crea el elemento div para el mensaje de error
const mensajeDeError = createErrorMessage('', '');
const finalizarCompraButton = document.getElementById('finalizarCompra');
finalizarCompraButton.parentNode.insertBefore(mensajeDeError, finalizarCompraButton);

const formularioenv = document.getElementById('formenvio');
const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

// Objeto que mapea nombres de campos a mensajes de error personalizados
const fieldErrorMessages = {
  'departamento': 'Falta ingresar el departamento',
  'calle': 'Falta ingresar la calle',
  'numero': 'Falta ingresar el número de puerta',
  'esquina': 'Falta ingresar la esquina'
};

formularioenv.addEventListener('submit', function (event) {
  event.preventDefault();

  // Restablece y oculta todos los mensajes de error.
  document.querySelectorAll('.error-message').forEach((error) => {
    error.textContent = ''; // Limpia el mensaje de error.
  });

  // Verifica los campos requeridos
  const requiredFields = ['departamento', 'calle', 'numero', 'esquina'];
  let hasEmptyField = false;

  requiredFields.forEach((field) => {
    const inputField = document.getElementById(field);
    if (!inputField.value.trim()) {
      const errorField = document.getElementById('error-' + field);
      errorField.textContent = fieldErrorMessages[field];
      hasEmptyField = true;
    }
  });

  // Verifica si se ha seleccionado un tipo de envío
  const tipoEnvioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
  if (!tipoEnvioSeleccionado) {
    // Si no se ha seleccionado ningún tipo de envío, muestra el mensaje de error.
    const errorTipoEnvio = document.getElementById('error-tipoEnvio');
    errorTipoEnvio.textContent = 'Debes seleccionar un tipo de envío';
  }

  if (hasEmptyField || !tipoEnvioSeleccionado) {
    // Mostrar el mensaje de error si hay campos vacíos o no se ha seleccionado un tipo de envío.
    mensajeDeError.textContent = 'Faltan ingresar datos';

} else {
    const exitoPago = true;

    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    if (selectedPaymentMethod === 'tarjeta') {
        const creditCardNumber = document.getElementById('creditCardNumber').value;
        const securityCode = document.getElementById('securityCode').value;
        const expirationDate = document.getElementById('expirationDate').value;

        if (!creditCardNumber.trim() || !securityCode.trim() || !expirationDate.trim()) {
            const errorContainer = createErrorMessage('', 'Faltan completar los datos de pago.');
            mensajeDeError.appendChild(errorContainer);
            return false; // Evita el envío del formulario si hay campos de pago vacíos.
        }
    }

    if (exitoPago) {
        // Llamamos a la función showSuccessAlert
        showSuccessAlert();
        setTimeout(function() {
          window.location.href = 'index.html';
      }, 2000);
    } else {
        // Limpiar el mensaje de error si el pago no tiene éxito.
        mensajeDeError.textContent = '';
    }
}
});

  if (emptyFields.length === 0) {
      const exitoPago = true; // 

      if (exitoPago) {
          formularioenv.submit();
      } else {
          // Limpiar el mensaje de error si el pago no tiene éxito
          mensajeDeError.textContent = '';
      }
  } else {
      // Mostrar el mensaje de error si hay campos vacíos
      mensajeDeError.textContent = 'Faltan ingresar datos';
  }

function createErrorMessage(errorText, errorDescription) {
  const mensajeDeError = document.createElement('div');
  mensajeDeError.id = 'error-message-finalizar-compra';

  const descriptionSpan = document.createElement('span');
  descriptionSpan.textContent = errorDescription;

  mensajeDeError.appendChild(descriptionSpan);

  const textSpan = document.createElement('span');
  textSpan.textContent = errorText;

  mensajeDeError.appendChild(textSpan);

  return mensajeDeError;
}

const confirmarPagoBtn = document.getElementById('confirmarPagoBtn');
confirmarPagoBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Aquí puedes realizar cualquier validación adicional antes de confirmar el pago.
    
    // Mostrar la alerta de éxito
    showSuccessAlert();

    // Demoramos la redirección por 2 segundos
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 2000);
  });

// -----------------------------------------------------------------
// FIN 3 DE LA ENTREGA 6
// -----------------------------------------------------------------

});
