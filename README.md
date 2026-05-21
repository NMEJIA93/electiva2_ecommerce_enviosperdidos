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
- **AWS SNS** (notificaciones por correo electrónico)

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
JWT_SECRET=tu_jwt_secreto_32_caracteres
JWT_EXPIRES_IN=24h
NODE_ENV=development

# AWS SNS (notificaciones por correo)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access-key
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:<account-id>:<topic-name>
```

### 4️⃣ Run the server

```sh
npm run start
```

El servidor estará en: [http://localhost:5000](http://localhost:5000)

---

## 🐳 Docker (Entorno de aprendizaje)

Esta versión incluye configuración para levantar API + MongoDB con Docker Compose.

### 1️⃣ Preparar variables de entorno

Si no tienes `.env`, crea uno basado en `.env.example`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 2️⃣ Levantar servicios

```sh
docker compose up --build -d
```

Servicios que se levantan:

- `app`: API Node.js (puerto `5000`)
- `mongo`: MongoDB local (puerto `27017`)

La API se conecta a Mongo mediante red interna de Compose usando:

```env
MONGODB_URI=mongodb://mongo:27017/ecommerce_enviosperdidos
```

### 3️⃣ Ver logs

```sh
docker compose logs -f app
```

### 4️⃣ Detener y limpiar

```sh
docker compose down
```

Si también quieres borrar datos de Mongo en este entorno de práctica:

```sh
docker compose down -v
```

---

## 🧱 Terraform

La infraestructura está dividida en tres módulos independientes:

```
terraform/
├── aws/     → Infraestructura base AWS (ECR, IAM Role, SNS). Se ejecuta una sola vez.
├── ec2/     → Despliegue en EC2 (build Docker, push ECR, crear instancia, correr contenedores). Lo ejecuta el pipeline.
└── docker/  → Contenedores locales (API + MongoDB). Solo para desarrollo individual.
```

### Módulo AWS — setup inicial (una sola vez)

Crea el repositorio ECR, el IAM Instance Profile para EC2 y el topic SNS. Requiere credenciales con permisos de ECR, IAM y SNS.

```powershell
cd terraform/aws
terraform init
terraform apply
```

Outputs relevantes:
- `ecr_repository_url` → URL del repositorio ECR donde se suben las imágenes
- `iam_instance_profile_name` → nombre del profile asignado a la EC2
- `sns_topic_arn` → ARN del topic SNS para notificaciones por correo

### Módulo EC2 — despliegue en AWS (lo ejecuta Jenkins)

Construye la imagen Docker, la sube a ECR y despliega una instancia EC2 (Amazon Linux 2023, t3.micro) con dos contenedores: MongoDB y la API.

```powershell
cd terraform/ec2
terraform init
terraform apply \
  -var="ecr_repository_url=<ECR_URL>" \
  -var="jwt_secret=<SECRET>" \
  -var="aws_sns_topic_arn=<SNS_ARN>" \
  -var="aws_access_key_id=<KEY_ID>" \
  -var="aws_secret_access_key=<SECRET_KEY>"
```

> En el pipeline de Jenkins todas las variables se inyectan automáticamente como `TF_VAR_*`.

Outputs:
- `ec2_public_ip` → IP pública de la instancia
- `api_url` → URL base de la API (`http://<IP>:5001/`)

#### Arquitectura de la instancia EC2

```
EC2 (t3.micro) — Amazon Linux 2023
│
├── Docker network: app-net
├── Contenedor: mongo        (puerto 27017, solo interno)
└── Contenedor: app (API)    (puerto 5001, expuesto al exterior)
```

El Security Group expone únicamente los puertos **22** (SSH) y **5001** (API). MongoDB no es alcanzable desde internet.

#### Comportamiento ante nuevos builds

Cada build de Jenkins genera un `IMAGE_TAG` distinto (igual al `BUILD_NUMBER`). Terraform detecta el cambio mediante `replace_triggered_by` y **recrea la instancia EC2** automáticamente, garantizando que siempre corra la imagen más reciente.

#### Destruir la instancia EC2

```powershell
$env:TF_VAR_ecr_repository_url   = "<ECR_URL>"
$env:TF_VAR_jwt_secret            = "<SECRET>"
$env:TF_VAR_aws_sns_topic_arn     = "<SNS_ARN>"
$env:TF_VAR_aws_access_key_id     = "<KEY_ID>"
$env:TF_VAR_aws_secret_access_key = "<SECRET_KEY>"
$env:TF_VAR_ssh_private_key_path  = "ruta/a/electiva2-ecommerce-key.pem"

cd terraform/ec2
terraform destroy -auto-approve
```

### Módulo Docker — entorno local (desarrollo)

```powershell
cd terraform/docker
terraform init
terraform apply
```

La API queda disponible en [http://localhost:5001](http://localhost:5001) y Swagger en [http://localhost:5001/api/v1/api-docs](http://localhost:5001/api/v1/api-docs).

### Prerequisitos manuales (antes del primer pipeline)

1. **Key Pair en AWS Console** → EC2 → Key Pairs → crear `electiva2-ecommerce-key` en formato `.pem` y descargarlo.
2. **Credential en Jenkins** → Manage Credentials → Secret file con ID `ec2-ssh-private-key` → subir el `.pem`.
3. **Aplicar `terraform/aws/`** para crear ECR e IAM Instance Profile antes de correr el pipeline por primera vez.

---

## 🔁 Pipeline CI/CD (Jenkins)

El pipeline automatiza build, push a ECR, despliegue en EC2 y verificación del endpoint. Soporta agentes Windows y Linux mediante `isUnix()`.

### Flujo de stages

```
┌──────────────────────┐
│  Install dependencies│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Run tests       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Terraform validate  │  ← terraform/ec2/
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Terraform apply    │  ← build Docker + push ECR + crear EC2 + correr contenedores
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Verify deployment   │  ← health check contra IP pública de EC2
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     post: always     │
└──────────────────────┘
```

### Descripción de cada stage

| Stage | Descripción |
|-------|-------------|
| **Install dependencies** | Ejecuta `npm install` para instalar las dependencias del proyecto. |
| **Run tests** | Corre la suite de pruebas con `npm test` (Jest). Si falla, el pipeline se detiene antes de tocar la infraestructura. |
| **Terraform validate** | Verifica el formato (`fmt -check`) y la validez sintáctica del módulo `terraform/ec2/`. Usa `-backend=false` para no necesitar estado remoto. |
| **Terraform apply** | Construye la imagen Docker localmente, la sube a ECR con tag `BUILD_NUMBER` y crea la instancia EC2 vía `remote-exec` (instala Docker, pull desde ECR, levanta MongoDB + API). |
| **Verify deployment** | Obtiene la IP pública de EC2 desde `terraform output` y hace polling a `http://<IP>:5001/` (hasta 30 intentos × 10 s) para confirmar que la API responde. |
| **post: always** | La instancia EC2 queda corriendo en AWS al finalizar el pipeline (éxito o falla). |

### Credenciales requeridas en Jenkins

| ID | Tipo | Uso |
|----|------|-----|
| `aws-access-key-id` | Secret text | `AWS_ACCESS_KEY_ID` para Terraform y el contenedor de la app |
| `aws-secret-access-key` | Secret text | `AWS_SECRET_ACCESS_KEY` para Terraform y el contenedor de la app |
| `ec2-ssh-private-key` | Secret file | Clave `.pem` para SSH en `remote-exec` |

### Soporte multiplataforma

Cada stage detecta el SO con `isUnix()` y ejecuta los comandos equivalentes en `sh` (Linux/Mac) o `bat`/`powershell` (Windows).

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