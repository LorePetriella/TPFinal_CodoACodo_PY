#TPF Codo a Codo FullStack Python (CRUD)
import mysql.connector   
from flask import Flask, request, jsonify
from flask_cors import CORS 


app = Flask(__name__)
# CORS(app) # Esto habilita CORS para todas las rutas
CORS(app, resources={r"/candidatos/*": {"origins": "*"}})  # Ejemplo: permitir todas las solicitudes a /candidatos


class GestorCandidatos:
# Constructor de la clase
    def __init__(self, host, user, password, database):
# Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password
        )
        self.cursor = self.conn.cursor()
        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
        # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS candidatos (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            apellido VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            cuerda VARCHAR(20) NOT NULL,
            experiencia BOOLEAN NOT NULL,
            lectura BOOLEAN NOT NULL,
            estudios BOOLEAN NOT NULL)''')
        self.conn.commit()
        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

# CRUD - READ (Listar candidatos)
    
    def listar_candidatos(self):
        self.cursor.execute("SELECT * FROM candidatos")
        candidatos = self.cursor.fetchall()
        return candidatos 
    
    # Consulta candidato
    def consulta_candidato(self, codigo):
        self.cursor.execute(f'SELECT * FROM candidatos WHERE codigo = {codigo}')
        return self.cursor.fetchone() #obtiene una sóla fila de la consulta SQL 
    
    #Mostrar candidato
    def mostrar_candidato(self, codigo):
        candidato = self.consulta_candidato(codigo)
        if candidato:
            print("-" * 40)
            print(f"Nombre.....: {candidato['nombre']}")
            print(f"Apellido...: {candidato['apellido']}")
            print(f"Email......: {candidato['email']}")
            print(f"Cuerda.....: {candidato['cuerda']}")
            print(f"Experiencia: {candidato['experiencia']}")
            print(f"Lectura....: {candidato['lectura']}")
            print(f"Estudios...: {candidato['estudios']}")
            print("-" * 40)
        else:
            print(f"No se encontró ningún candidato con el código {codigo}.")       
 
# CRUD - Create (Agregar candidato)

    def agregar_candidato(self, nombre, apellido, email, cuerda, experiencia, lectura, estudios): 
        sql = "INSERT INTO candidatos (nombre, apellido, email, cuerda, experiencia, lectura, estudios) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, apellido, email, cuerda, experiencia, lectura, estudios) #lOS VALORES DEBEN LLEGARLE DESDE EL FORM DEL FRONT
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid
    
     
    
#     #Modificar candidato
    def modificar_candidato(self, codigo, nuevo_nombre, nuevo_apellido, nuevo_email, nueva_cuerda, nueva_experiencia, nueva_lectura, nuevos_estudios):
        sql = "UPDATE candidatos SET nombre = %s, apellido = %s, email = %s, cuerda = %s, experiencia = %s, lectura = %s, estudios = %s WHERE codigo = %s"
        valores = (nuevo_nombre, nuevo_apellido, nuevo_email, nueva_cuerda, nueva_experiencia, nueva_lectura, nuevos_estudios, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    
# # CRUD - Delete (Eliminar candidato)

    def eliminar_candidato(self, codigo):

        self.cursor.execute(f"DELETE FROM candidatos WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0




#PROGRAMA PRINCIPAL

#instancio Gestor
gestor_candidatos = GestorCandidatos(host='lorepetriella.mysql.pythonanywhere-services.com', user='lorepetriella', password='codo78',database='lorepetriella$gestor_candidatos_coro')

# Manejar solicitud OPTIONS para la ruta /candidatos/
@app.route('/candidatos/', methods=['OPTIONS'])
def options():
    return '', 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    }

@app.route('/candidatos/<int:codigo>', methods=['OPTIONS'])
def options_candidato(codigo):
    return '', 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }


@app.route("/candidatos", methods=["GET"])
def listar_candidatos():
    candidatos = gestor_candidatos.listar_candidatos()
    return jsonify(candidatos) 

@app.route("/candidatos/<int:codigo>", methods=["GET"])
def mostrar_candidato(codigo):
    candidato = gestor_candidatos.consulta_candidato(codigo)
    if candidato:
        return jsonify(candidato), 201
    else: 
        return "Candidato no encontrado", 404
    

@app.route("/candidatos", methods=["POST"])
def agregar_candidato():
#Recojo los datos del form

    nombre = request.form['nombre']
    apellido = request.form['apellido']
    email = request.form['email']
    cuerda = request.form['cuerda']
    experiencia = request.form['experiencia'] == 'SI'
    lectura = request.form['lectura'] == 'SI'
    estudios = request.form['estudios'] == 'SI'

    print(f"Nombre: {nombre}, Apellido: {apellido}, Email: {email}, Cuerda: {cuerda}, Experiencia: {experiencia}, Lectura: {lectura}, Estudios: {estudios}")

    nuevo_codigo = gestor_candidatos.agregar_candidato(nombre, apellido, email, cuerda, experiencia, lectura, estudios)
    if nuevo_codigo:
   
        return jsonify({"mensaje": "Candidato agregado correctamente.",
        "codigo": nuevo_codigo}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el candidato."}), 500
    


@app.route("/candidatos/<int:codigo>", methods=["PUT"])
def modificar_candidato(codigo):
#Se recuperan los nuevos datos del formulario

    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nuevo_email = request.form.get("email")
    nueva_cuerda = request.form.get("cuerda")
    nueva_experiencia = request.form.get("experiencia") == 'SI'
    nueva_lectura = request.form.get("lectura") == 'SI'
    nuevos_estudios = request.form.get("estudios") == 'SI'
  # Busco el candidato guardado
    candidato = gestor_candidatos.consulta_candidato(codigo)

    if candidato:
        # Se llama al método modificar_producto pasando el código del producto y los nuevos datos
        if gestor_candidatos.modificar_candidato(codigo, nuevo_nombre, nuevo_apellido, nuevo_email, nueva_cuerda, nueva_experiencia, nueva_lectura,  nuevos_estudios):
            return jsonify({"mensaje": "Candidato modificado"}), 200
        else:
            return jsonify({"mensaje": "Error al modificar el candidato"}), 500
    else:
        return jsonify({"mensaje": "Candidato no encontrado"}), 404
    

@app.route("/candidatos/<int:codigo>", methods=["DELETE"])
def eliminar_candidato(codigo):
# Primero, obtiene la información del producto para encontrar la imagen
    candidato = gestor_candidatos.consulta_candidato(codigo)
    if candidato:    
    # Luego, elimina el producto del catálogo
        if gestor_candidatos.eliminar_candidato(codigo):
            return jsonify({"mensaje": "Candidato eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el candidato"}), 500
    else:
        return jsonify({"mensaje": "Candidato no encontrado"}), 404    


    
if __name__ == "__main__":
    app.run(debug=True)










