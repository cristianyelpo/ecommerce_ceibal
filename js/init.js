const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Comprueba el estado almacenado en localStorage: modo-día o modo-noche
const checkbox = document.getElementById('switch-label');
const body = document.body;
const modoNocheGuardado = localStorage.getItem('modo-noche');

if (modoNocheGuardado === 'true') {
    checkbox.checked = true;
    body.classList.add('modo-noche'); // Aplicar modo noche 
}

// Función para alternar entre modo día y modo noche
function alternarModo() {
    if (checkbox.checked) {
        // Cambiar a modo noche
        body.classList.add('modo-noche');
        // Guardar el estado en el almacenamiento local
        localStorage.setItem('modo-noche', 'true');
    } else {
        // Cambiar a modo día
        body.classList.remove('modo-noche');
        // Guardar el estado en el almacenamiento local
        localStorage.setItem('modo-noche', 'false');
    }
}

// Agrega un controlador de eventos al checkbox
checkbox.addEventListener('change', alternarModo);




