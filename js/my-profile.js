////////// Codigo del Nombre////////////
document.addEventListener("DOMContentLoaded", () => {
    const usernameElement = document.getElementById("username");
    const storedUsername = sessionStorage.getItem("loggedIn");

    if (storedUsername) {
        usernameElement.textContent = "Usuario: " + storedUsername;
    }
});
////////// Codigo del Nombre////////////

