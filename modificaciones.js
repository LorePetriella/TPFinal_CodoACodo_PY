//            -------------------------------------------------------------------------------------
//                                 Script para Mofificar Candidatos (UPDATE)
//            -------------------------------------------------------------------------------------
const URL = "https://lorepetriella.pythonanywhere.com/";
// Variables de estado para controlar la visibilidad y los datos del formulario
let codigo = "";
let nombre = "";
let apellido = "";
let email = "";
let cuerda = "";
let experiencia = "";
let lectura = "";
let estudios = "";
let mostrarDatosCandidato = false;

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-obtener-candidato")
    .addEventListener("submit", obtenerCandidato);
  document
    .getElementById("form-guardar-cambios")
    .addEventListener("submit", guardarCambios);
});
// Se ejecuta cuando se envía el formulario de consulta. Realiza una solicitud GET a la API y obtiene los datos del producto correspondiente al código ingresado.
function obtenerCandidato(event) {
  event.preventDefault();
  code = document.getElementById("codigo").value;
  console.log(code)
  fetch(URL + "candidatos/" + code)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos del candidato.");
      }
    })
    .then((data) => {
      codigo = data.codigo
      nombre = data.nombre;
      apellido = data.apellido;
      email = data.email;
      cuerda = data.cuerda;
      experiencia = data.experiencia;
      lectura = data.lectura;
      estudios = data.estudios;
      mostrarDatosCandidato = true; //Activa la vista del segundo formulario

      mostrarFormulario();
    })
    .catch((error) => {
      alert("Código no encontrado.");
    });
}
// Muestra el formulario con los datos del producto
function mostrarFormulario() {
    if (mostrarDatosCandidato) {
        document.getElementById('modificarNombre').value = nombre;
        document.getElementById('modificarApellido').value = apellido;
        document.getElementById('modificarEmail').value = email;
        document.getElementById('modificarCuerda').value = cuerda;
        // Configurar radio buttons para experiencia
        if (experiencia === 'SI') {
            document.getElementById('modificarExpSi').checked = true;
        } else if (experiencia === 'NO') {
            document.getElementById('modificarExpNo').checked = true;
        }

        // Configurar radio buttons para lectura
        if (lectura === 'SI') {
            document.getElementById('modificarLecturaSi').checked = true;
        } else if (lectura === 'NO') {
            document.getElementById('modificarLecturaNo').checked = true;
        }

        // Configurar radio buttons para estudios
        if (estudios === 'SI') {
            document.getElementById('modificarEstudiosSi').checked = true;
        } else if (estudios === 'NO') {
            document.getElementById('modificarEstudiosNo').checked = true;
        }

        document.getElementById('datos-candidato').classList.remove('visually-hidden'); 
        
        document.getElementById('getByCode').classList.add('visually-hidden');
    
    } else {
        document.getElementById('datos-candidato').classList.add('visually-hidden');
    
    }
}


// Se usa para enviar los datos modificados del producto al servidor.
function guardarCambios(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("nombre", document.getElementById("modificarNombre").value);
  formData.append(
    "apellido",
    document.getElementById("modificarApellido").value
  );
  formData.append("email", document.getElementById("modificarEmail").value);
  formData.append("cuerda", document.getElementById("modificarCuerda").value);
  // Obtener valor de experiencia
  const experiencia = document.querySelector(
    'input[name="experiencia"]:checked'
  ).value;
  formData.append("experiencia", experiencia);

  // Obtener valor de lectura
  const lectura = document.querySelector('input[name="lectura"]:checked').value;
  formData.append("lectura", lectura);

  // Obtener valor de estudios
  const estudios = document.querySelector(
    'input[name="estudios"]:checked'
  ).value;
  formData.append("estudios", estudios);

  fetch(URL + "candidatos/" + codigo, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al guardar los cambios del candidato.");
      }
    })

    .then((data) => {
      alert("Candidato actualizado correctamente.");
      limpiarFormulario();
    })

    .catch((error) => {
      console.error("Error:", error);
      alert("Error al actualizar el candidato.");
    });
}
// Restablece todas las variables relacionadas con el formulario     a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
//   document.getElementById("codigo").value = "";
  document.getElementById("modificarNombre").value = "";
  document.getElementById("modificarApellido").value = "";
  document.getElementById("modificarEmail").value = "";
  document.getElementById("modificarCuerda").value = "";
  // Función para vaciar los elementos de radio de una categoría específica
  function resetRadioButtons(radioName) {
    // Selecciona todos los elementos de radio con el mismo nombre
    const radios = document.querySelectorAll('input[name="' + radioName + '"]');

    // Itera sobre cada elemento de radio y lo deselecciona
    radios.forEach(function (radio) {
      radio.checked = false;
    });
  }

  // Llamar a la función para vaciar los elementos de radio
  resetRadioButtons("experiencia");
  resetRadioButtons("lectura");
  resetRadioButtons("estudios");

  codigo = "";
  nombre = "";
  apellido = "";
  email = "";
  cuerda = "";
  experiencia = "";
  lectura = "";
  estudios = "";
  mostrarDatosCandidato = false;

  document.getElementById('datos-candidato').classList.add('visually-hidden');
  document.getElementById('getByCode').classList.remove('visually-hidden');
  
}