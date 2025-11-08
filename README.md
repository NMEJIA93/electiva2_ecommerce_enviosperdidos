# 🚚 Electiva2 Ecommerce - Envios Perdidos

## 📖 Overview

Backend API (Node.js + TypeScript) para gestión de usuarios, productos, proveedores, categorías, inventario, preorden y órdenes.  
Sigue **Hexagonal Architecture** (Ports & Adapters) y principios **DDD**.  
Incluye validaciones robustas, autenticación JWT, y persistencia en MongoDB (Mongoose).

---

## 🛠️ Tech Stack

- **Node.js**
- **TypeScript**
- **Express v5**
- **Mongoose (MongoDB ODM)**
- **dotenv**
- **Swagger UI** (documentación interactiva)

Dev tools:
- `ts-node-dev`
- `@types/node`, `@types/express`
- **Jest** (pruebas unitarias)

---

## ⚡ Quick Start

### 1️⃣ Clone the repository

```sh
git clone https://github.com/NMEJIA93/electiva2_ecommerce_enviosperdidos.git
cd electiva2_ecommerce_enviosperdidos
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Configure environment variables

Copia `.env.example` a `.env` y completa tus valores:

```sh
cp .env.example .env
```

Ejemplo:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>
DB_NAME=electiva2
JWT_SECRET=tu_jwt_secreto_32_caracteres
JWT_EXPIRES_IN=24h

# Email Configuration (Optional - for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS_APP=your-16-char-app-password
NODE_ENV=development
```

### 4️⃣ Run the server

```sh
npm run start
```

El servidor estará en: [http://localhost:5000](http://localhost:5000)

---

## 📚 API Documentation

### 📝 Swagger UI

Documentación interactiva disponible vía Swagger.

- Abre [http://localhost:5000/api/v1/api-docs](http://localhost:5000/api/v1/api-docs) en tu navegador.

La documentación está en [`swagger.yaml`](swagger.yaml).

---

## 📦 Endpoints principales

Base path: `/api/v1`

| Método | Endpoint                                         | Descripción                                 |
|--------|--------------------------------------------------|---------------------------------------------|
| POST   | `/auth/register`                                 | Registro de usuario                         |
| POST   | `/auth/login`                                    | Login y obtención de JWT                    |
| GET    | `/user/profile/:id`                              | Perfil de usuario                           |
| GET    | `/users`                                         | Listar todos los usuarios                   |
| POST   | `/product`                                       | Crear producto                              |
| GET    | `/product`                                       | Listar productos                            |
| POST   | `/user/:userId/preorder`                         | Crear preorden (checkout)                   |
| PATCH  | `/user/:userId/preorder/:preorderId/confirm`     | Confirmar preorden y crear orden            |
| GET    | `/orders/user/:userId`                           | Ver órdenes de usuario                      |
| POST   | `/provider`                                      | Crear proveedor                             |
| GET    | `/product/categories`                            | Listar categorías                           |
| PUT    | `/product/inventory/:id`                         | Actualizar inventario                       |

Más detalles en [Swagger UI](http://localhost:5000/api/v1/api-docs).

---

## 🧭 Project Structure

```
src/
  app.ts
  application/
    controllers/
    dtos/
    middlewares/
    routes/
  domain/
    entities/
    models/
      interfaces/
    repositories/
    services/
    business-rules/
  infraestructure/
    config/
    database/
    interface/
    repositories/
swagger.yaml
```

---

## 🛡️ Reglas de negocio implementadas

- Email único y contraseña segura en registro.
- Validación de stock y dirección en checkout.
- Envío gratuito para órdenes mayores a $50,000 COP.
- Confirmación de pedido con número único y descuento automático de inventario.
- Solo productos activos y con stock > 0 visibles.
- Validaciones robustas en DTOs y middlewares.
- Autenticación JWT y autorización por roles.

---

## 🧪 Testing

- Pruebas unitarias con Jest para controladores y servicios principales.
- Cobertura disponible en carpeta `/coverage`.


---

## 📄 License

[MIT](LICENSE)