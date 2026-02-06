# Sistema de Gestión Académica - Dashboard Ejecutivo


## Descripción
Este proyecto es un Dashboard diseñado para la toma de decisiones académicas. El cual permite visualizar indicadores clave (KPIs) como asistencia, riesgo de deserción, rendimiento por materia y carga docente.

La arquitectura se basa en el consumo de Vistas SQL (Views) y datos pre-procesados en PostgreSQL, garantizando seguridad y eficiencia. El frontend está construido con Next.js (App Router).

## Tecnologías

* **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS.
* **Base de Datos:** PostgreSQL 15.
* **Contenedorización:** Docker & Docker Compose.
* **Seguridad:** Roles de base de datos (RBAC) y variables de entorno.

---



## ️ Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jesel8D/243692_Evaluacion_Practica_C1_AWOS
cd evaluacion_practica
```
### 2. Configurar Variables de Entorno
Se necesita crear un archivo .env en la raíz del proyecto copiando el ejemplo proporcionado.
```bash
cp .env
```
### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecución del Proyecto (Requiere 2 Terminales)

Para levantar el sistema correctamente, se necesita abrir dos terminales y ejecutarlas en el siguiente orden:

Terminal 1: Base de Datos Ejecutar el contenedor de Docker para iniciar la base de datos (esto creará tablas y vistas automáticamente).
```bash
docker-compose up -d
```

Terminal 2: Aplicación Web Abre. Se necesita abrir una nueva terminal, por lo cual hay que asegurarse de estar en la carpeta del proyecto e inicia el servidor de desarrollo.
```bash
npm run dev
```