document.addEventListener("DOMContentLoaded", function () {

    
    const cerrarsesion=document.getElementById("cerrar_sesion");
    //al clickear en "cerrar sesion" se elimina la informacion del localStorage y se redirige al login.
    cerrarsesion.addEventListener("click", event => {
        event.preventDefault();
        localStorage.removeItem('loggedIn');
        window.location.href='login.html';
        
    });



    // al cargar la página si no  tenemos en el localStorage LoggedIn nos dirige al login
    if (!localStorage.getItem('loggedIn')) {
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

    document.getElementById("herramientas").addEventListener("click", function () {
        localStorage.setItem("catID", 104);
        window.location = "products.html"
    });

    document.getElementById("computadoras").addEventListener("click", function () {
        localStorage.setItem("catID", 105);
        window.location = "products.html"
    });

    document.getElementById("vestimenta").addEventListener("click", function () {
        localStorage.setItem("catID", 106);
        window.location = "products.html"
    });

    document.getElementById("electrodomesticos").addEventListener("click", function () {
        localStorage.setItem("catID", 107);
        window.location = "products.html"
    });

    document.getElementById("deportes").addEventListener("click", function () {
        localStorage.setItem("catID", 108);
        window.location = "products.html"
    });

    document.getElementById("celulares").addEventListener("click", function () {
        localStorage.setItem("catID", 109);
        window.location = "products.html"
    });


});