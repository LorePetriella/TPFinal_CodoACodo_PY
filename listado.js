//            -------------------------------------------------------------------------------------
//                                 Script para Listar Candidatos (READ)
//            -------------------------------------------------------------------------------------
const URL = "https://lorepetriella.pythonanywhere.com/";
// Realizamos la solicitud GET al servidor para obtener todos los productos.
fetch(URL + "candidatos")
  .then(function (response) {
    if (response.ok) {
      //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
      return response.json();
    } else {
      // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante

      throw new Error("Error al obtener los candidatos.");
    }
  })
  //Esta función maneja los datos convertidos del JSON.
  .then(function (data) {
    let tablaCandidatos = document.getElementById('tabla-candidatos');
    // Iteramos sobre cada producto y agregamos filas a la tabla

    for (let candidato of data) {
      let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada producto.

      fila.innerHTML =
        "<td>" +
        candidato.codigo +
        "</td>" +
        "<td>" +
        candidato.nombre +
        "</td>" +
        '<td>' +
        candidato.apellido +
        "</td>" +
        '<td>' +
        candidato.email +
        "</td>" +
        '<td>' +
        candidato.cuerda +
        "</td>" +
        '<td>' +
        (candidato.experiencia === 1 ? 'Si' : 'No')  +
        "</td>" +
        '<td>' +
        (candidato.lectura === 1 ? 'Si' : 'No') +
        "</td>" +
        '<td>' +
        (candidato.estudios === 1 ? 'Si' : 'No')  +
        "</td>";

      //Una vez que se crea la fila con el contenido del producto, se agrega a la tabla utilizando el método appendChild del elemento tablaProductos.

      tablaCandidatos.appendChild(fila);
    }
  })
  //Captura y maneja errores, mostrando una alerta en caso de error al obtener los productos.
  .catch(function (error) {
    // Código para manejar errores
    alert("Error al obtener los candidatos.");
  });
