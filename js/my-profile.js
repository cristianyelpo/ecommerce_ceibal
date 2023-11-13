/* ENTREGA 7 PARTE 1 */

// Muestra el nombre de usuario en la barra superior antes de ejecutar el resto del código
const usernameElementInBar = document.getElementById("username");
const storedUsername = localStorage.getItem("loggedIn");

if (storedUsername) {
    usernameElementInBar.textContent = "Usuario: " + storedUsername;
}

document.addEventListener("DOMContentLoaded", () => {
    const emailElement = document.getElementById("email");
    const storedEmail = localStorage.getItem("loggedIn");  // Nombre de usuario y correo electrónico

    if (storedEmail) {
        // Mostrar el nombre de usuario (correo electrónico) en el campo "E-mail"
        emailElement.value = storedEmail;

        // Obtener los elementos relacionados con la imagen de perfil
        const profileImageInput = document.getElementById("profileImage");
        const profileImageDisplay = document.getElementById("profileImageDisplay");
        
        // Cargar la imagen de perfil desde Local Storage
        const storedProfileImage = localStorage.getItem("profileImage");
        if (storedProfileImage) {
        profileImageDisplay.src = storedProfileImage;
        }

        // Cuando el usuario selecciona una nueva imagen, guardarla en Local Storage
        profileImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileImageDisplay.src = e.target.result;
                    profileImageDisplay.style.display = "block";

                    // Guardar la imagen en Local Storage
                    localStorage.setItem("profileImage", e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });    

    const firstNameElement = document.getElementById("firstName");
    const secondNameElement = document.getElementById("secondName");
    const lastNameElement = document.getElementById("lastName");
    const secondLastNameElement = document.getElementById("secondLastName");
    const phoneNumberElement = document.getElementById("phoneNumber");
    const saveButton = document.getElementById("saveButton");

        // Llenar campos del perfil si están disponibles en localStorage
        const userProfileData = JSON.parse(localStorage.getItem("userProfile"));
        if (userProfileData) {
            firstNameElement.value = userProfileData.firstName || '';
            secondNameElement.value = userProfileData.secondName || '';
            lastNameElement.value = userProfileData.lastName || '';
            secondLastNameElement.value = userProfileData.secondLastName || '';
            phoneNumberElement.value = userProfileData.phoneNumber || '';
        }

        if (saveButton) {
            saveButton.addEventListener("click", () => {
                // Obtener los valores de los campos del perfil
                const firstName = firstNameElement.value;
                const secondName = secondNameElement.value;
                const lastName = lastNameElement.value;
                const secondLastName = secondLastNameElement.value;
                const phoneNumber = phoneNumberElement.value;

                // Validar que los campos obligatorios no estén vacíos
                if (firstName.trim() === '' || lastName.trim() === '') {
                    alert('Los campos "Primer nombre" y "Primer apellido" son obligatorios');
                    return;
                }

                // Guardar los datos en localStorage (puedes utilizar JSON.stringify si necesitas guardar objetos)
                localStorage.setItem("userProfile", JSON.stringify({
                    firstName,
                    secondName,
                    lastName,
                    secondLastName,
                    phoneNumber,
                }));

                // Puedes mostrar un mensaje de confirmación al usuario
                alert("Perfil actualizado con éxito");
            });
        }
    }
});

/* FIN ENTREGA 7 PARTE 1 */

