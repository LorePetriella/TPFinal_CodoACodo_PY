//            -------------------------------------------------------------------------------------
//                                 Script para Eliminar Candidatos (DELETE)
//            -------------------------------------------------------------------------------------
const URL = "https://lorepetriella.pythonanywhere.com/";
// Obtiene el contenido del inventario
function obtenerCandidatos() {
    fetch(URL + 'candidatos') // Realiza una solicitud GET al servidor y obtener la lista de productos.
    .then(response => {
    // Si es exitosa (response.ok), convierte los datos de la respuesta de formato JSON a un objeto JavaScript.
    
    if (response.ok) { 
        return response.json();
     } else {
        throw new Error('Error al obtener los candidatos.');
     }
    })
    // Asigna los datos de los productos obtenidos a la propiedad productos del estado.
    .then(data => {
    const  deleteTable = document.getElementById('delete-table').getElementsByTagName('tbody')[0];

    deleteTable.innerHTML = ''; // Limpia la tabla antes de insertar nuevos datos

data.forEach(candidato => {
const row = deleteTable.insertRow();
 row.setAttribute('data-codigo', candidato.codigo); // Añadir atributo para identificación
row.innerHTML = `

<td>${candidato.codigo}</td>
<td>${candidato.nombre}</td>
<td>${candidato.apellido}</td>
<td>${candidato.email}</td>
<td>${candidato.cuerda}</td>
<td>${(candidato.experiencia === 1 ? 'Si' : 'No')}</td>
<td>${(candidato.lectura === 1 ? 'Si' : 'No')}</td>
<td>${(candidato.estudios === 1 ? 'Si' : 'No')}</td> 
<td><button class="btn btn-dark btn-sm m-1" onclick="eliminarCandidato('${candidato.codigo}')">Eliminar</button></td>
`;
});
})
// Captura y maneja errores, mostrando una alerta en caso de error al obtener los productos.
.catch(error => {
console.log('Error:', error);
alert('Error al obtener los candidatos.');
});
}
// Se utiliza para eliminar un producto.
function eliminarCandidato(codigo) {
// Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de
// fetch(URL + `candidatos/${codigo}`, {method: 'DELETE' })

if (confirm('¿Estás seguro de que quieres eliminar este candidato?')){

fetch(URL + `candidatos/${codigo}`, { method: 'DELETE' })
.then(response => {
    if (response.ok) {
// Si es exitosa (response.ok), elimina el producto y da mensaje de ok.
 // Elimina la fila del candidato eliminado directamente del DOM
 const filaAEliminar = document.querySelector(`#delete-table tbody tr[data-codigo="${codigo}"]`);
 if (filaAEliminar) {
     filaAEliminar.remove();
 }


    // obtenerCandidatos(); // Vuelve a obtener la lista de productos para actualizar la tabla.

    alert('Candidato eliminado correctamente.');
} else {
    throw new Error('Error al eliminar candidato.');
}

})
// En caso de error, mostramos una alerta con un mensaje de error.

.catch(error => {
alert(error.message);
});
}
};
// Cuando la página se carga, llama a obtenerProductos para cargar la lista de productos.
document.addEventListener('DOMContentLoaded', obtenerCandidatos);