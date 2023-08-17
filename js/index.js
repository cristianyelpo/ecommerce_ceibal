document.addEventListener("DOMContentLoaded", function () {

    // al cargar la página si no  tenemos en el sessionStorage LoggedIn nos dirige al login
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
    }
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});