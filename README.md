# 🔐 Node Auth API

Una API de autenticación y autorización construida con **Node.js**, que incluye registro, login, generación de **JSON Web Tokens (JWT)** y validación de usuarios. 
## 🚀 Instalación

Clona el repositorio y entra en la carpeta:

```bash
git clone https://github.com/SergioRamirez06/node-skeleton.git
cd node-skeleton

1. Clonar .env.template a .env y configurar las variables de entorno.
2. Ejecutar `npm install` para instalar las dependencias.
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Llenar la base de datos con los datos de prueba ejecutando npm run seed
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo.
```

## 🚀 Características

- Registro de usuarios con encriptación de contraseñas (bcrypt).  
- Inicio de sesión con validación de credenciales.  
- Generación y validación de tokens JWT.  
- Middleware para proteger rutas privadas.  
- Arquitectura modular siguiendo principios SOLID.  
- Configuración de variables de entorno con `.env`.  

---

## 📦 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/) con Mongoose  
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)  
- [bcrypt](https://www.npmjs.com/package/bcrypt)  
- [dotenv](https://www.npmjs.com/package/dotenv)  

---

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/SergioRamirez06/node-auth-api.git

