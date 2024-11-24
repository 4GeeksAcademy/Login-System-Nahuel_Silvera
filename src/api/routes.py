"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import generate_sitemap, APIException
import bcrypt
import datetime 
#from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
#CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# [POST] /token - Tokenización de usuario (En caso de ser necesario)

@api.route('/token', methods=['POST'])
def generate_token():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "El email y la contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "El usuario o la contraseña son inválidos"}), 401

    access_token = create_access_token(
        identity=user.id, 
        expires_delta=datetime.timedelta(hours=1)  # El token expira en 1 hora, por seguridad
    )

    return jsonify({'token': access_token}), 200



# Endpoint - Registro #

@api.route('/signup', methods=['POST'])
def signup():

    # Obtener datos #
    body = request.json
    username = body.get('username')
    email = body.get('email')
    password = body.get('password')

    # Validar datos #

    if not username or not email or not password:
        return jsonify({"message": "Missing arguments"}), 400
    
    # Generar hash de la contraseña #

    bpassword = bytes(password, 'utf-8') # Convertimos la contraseña a Bytes.
    salt = bcrypt.gensalt(14) # Básicamente sirve para generar un cifrado
    hashed_password = bcrypt.hashpw(bpassword, salt) # Devolvemos la contraseña hasheada

    # Creamos el usuario #

    new_user = User(username=username, email=email, password=hashed_password.decode('utf-8')) # Leí que si lo especificamos de esta manera si la estructura cambia en un futuro, los campos se asignan correctamente igual.

    # Guardamos el usuario en la BD #
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as exception:
        db.session.rollback() 
        return jsonify({"message": "Se produjo un error al crear el usuario", "error": str(exception)}), 500
    return jsonify({"message": f"Se ha creado el usuario: {new_user.email}"}), 201


# Endpoint - Login #
@api.route('/login', methods=['POST'])
def login_acess():
    body = request.json
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"message": "El email y la contraseña son requeridos"}), 400
    
    # Si no son vacios, buscamos en la BD

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):  # Verifica la contraseña

        # No se consume el endpoint de tokenización porque no es necesario, es mejor generar el token directamente
        access_token = create_access_token(
            identity=user.id,  # Usa el ID del usuario como identidad
            expires_delta=datetime.timedelta(hours=1)
        )

        return jsonify({
            "message": "Inicio de sesión correcto",
            "token": access_token, 
            "user": {"email": user.email}
        }), 200
    else:
        # Si las credenciales son incorrectas
        return jsonify({"message": "El usuario o contraseña no son correctos."}), 401