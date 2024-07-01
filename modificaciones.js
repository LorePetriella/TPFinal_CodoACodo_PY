// //            -------------------------------------------------------------------------------------
// //                                 Script para Mofificar Candidatos (UPDATE)
// //            -------------------------------------------------------------------------------------
const URL = "https://lorepetriella.pythonanywhere.com/";

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

function obtenerCandidato(event) {
  event.preventDefault();
  codigo = document.getElementById("codigo").value;
  fetch(URL + "candidatos/" + codigo)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos del candidato.");
      }
    })
    .then((data) => {
      codigo = data.codigo;
      nombre = data.nombre;
      apellido = data.apellido;
      email = data.email;
      cuerda = data.cuerda;
      experiencia = data.experiencia.toString(); 
      lectura = data.lectura.toString(); 
      estudios = data.estudios.toString(); 
      mostrarDatosCandidato = true;

      mostrarFormulario();
    })
    .catch((error) => {
      alert("Código no encontrado.");
    });
}

function mostrarFormulario() {
  if (mostrarDatosCandidato) {
    document.getElementById("modificarNombre").value = nombre;
    document.getElementById("modificarApellido").value = apellido;
    document.getElementById("modificarEmail").value = email;
    document.getElementById("modificarCuerda").value = cuerda;

    // Configurar radio buttons para experiencia
    document.getElementById("modificarExpSi").checked = experiencia === "1";
    document.getElementById("modificarExpNo").checked = experiencia === "0";

    // Configurar radio buttons para lectura
    document.getElementById("modificarLecturaSi").checked = lectura === "1";
    document.getElementById("modificarLecturaNo").checked = lectura === "0";

    // Configurar radio buttons para estudios
    document.getElementById("modificarEstudiosSi").checked = estudios === "1";
    document.getElementById("modificarEstudiosNo").checked = estudios === "0";

    document.getElementById("datos-candidato").classList.remove("visually-hidden");
    document.getElementById("getByCode").classList.add("visually-hidden");
  } else {
    document.getElementById("datos-candidato").classList.add("visually-hidden");
  }
}

function guardarCambios(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("nombre", document.getElementById("modificarNombre").value);
  formData.append("apellido", document.getElementById("modificarApellido").value);
  formData.append("email", document.getElementById("modificarEmail").value);
  formData.append("cuerda", document.getElementById("modificarCuerda").value);
  formData.append("experiencia", document.querySelector('input[name="experiencia"]:checked').value);
  formData.append("lectura", document.querySelector('input[name="lectura"]:checked').value);
  formData.append("estudios", document.querySelector('input[name="estudios"]:checked').value);



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

function limpiarFormulario() {
  document.getElementById("modificarNombre").value = "";
  document.getElementById("modificarApellido").value = "";
  document.getElementById("modificarEmail").value = "";
  document.getElementById("modificarCuerda").value = "";

  // Limpiar radio buttons
  document.getElementById("modificarExpSi").checked = false;
  document.getElementById("modificarExpNo").checked = false;
  document.getElementById("modificarLecturaSi").checked = false;
  document.getElementById("modificarLecturaNo").checked = false;
  document.getElementById("modificarEstudiosSi").checked = false;
  document.getElementById("modificarEstudiosNo").checked = false;

  codigo = "";
  nombre = "";
  apellido = "";
  email = "";
  cuerda = "";
  experiencia = "";
  lectura = "";
  estudios = "";
  mostrarDatosCandidato = false;

  document.getElementById("datos-candidato").classList.add("visually-hidden");
  document.getElementById("getByCode").classList.remove("visually-hidden");
}
