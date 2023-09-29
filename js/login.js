/* Al hacer click en en el botón enviar, si tiene ambos campos del formulario completos guarda datos en el session storage y nos redirige al index.html */


const boton = document.getElementById("button23");


boton.addEventListener("click", evento => {
    console.log(sessionStorage);
    evento.preventDefault();
    const usuario = document.getElementById("username").value;
    const contrasea = document.getElementById("password").value;

    if (usuario !== "" && contrasea !== "") {
        sessionStorage.setItem('loggedIn', usuario);
        window.location.href = 'index.html';
    } else alert("Para continuar por favor complete los campos del formulario")
});


