// //            -------------------------------------------------------------------------------------
// //                                 Script para Agregar Candidato (CREATE)
// //            -------------------------------------------------------------------------------------
const URL = "https://lorepetriella.pythonanywhere.com/";
const auditionForm = document.getElementById("audition-form");

// Capturamos el evento de envío del formulario
auditionForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitamos que se envie el form
  // Validamos el formulario usando Bootstrap
  if (!auditionForm.checkValidity()) {
    event.stopPropagation(); // Evitar la propagación si el formulario no es válido
    auditionForm.classList.add("was-validated"); // Agregar clases de validación de Bootstrap
  } else {
    // Limpiar cualquier clase de validación previa
    auditionForm.classList.remove("was-validated");

    const formData = new FormData(auditionForm);

    // Realizamos la solicitud POST al servidor
    fetch(URL + "candidatos", {
      method: "POST",
      body: formData, // Aquí enviamos formData. Dado que formData puede contener archivos, no se utiliza JSON.
    })
      //Después de realizar la solicitud POST, se utiliza el método then() para manejar la respuesta del servidor.
      .then(function (response) {
        if (response.ok) {
          //Si la respuesta es exitosa, convierte los datos de la respuesta a formato JSON.

          return response.json();
        } else {
          // Si hubo un error, lanzar explícitamente una excepción

          // para ser "catcheada" más adelante
          throw new Error("Error al agregar el candidato.");
        }
      })
      //Respuesta OK, muestra una alerta informando que el producto se agregó correctamente y limpia los campos del formulario para que puedan ser utilizados para un nuevo producto.

      .then(function (data) {
        alert("Candidato agregado correctamente.");
        auditionForm.reset(); // Limpiar el formulario después de éxito
      })

      // En caso de error, mostramos una alerta con un mensaje de error.

      .catch(function (error) {
        alert("Error al agregar el candidato.");
        console.error("Error:", error);
      });
  }
});