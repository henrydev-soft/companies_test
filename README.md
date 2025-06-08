# 🧠 Proyecto Full Stack: Gestión de Empresas y Productos

Este es un sistema web construido con **Django REST Framework** y **React**, que permite gestionar empresas y sus productos. Incluye autenticación con roles, exportación a PDF y funcionalidad adicional con **IA y Blockchain (simulado)**.

## 📁 Estructura del Proyecto

```
root/
├── backend/              # API REST con Django + DRF + PostgreSQL
├── frontend/             # Interfaz de usuario con React + Vite
├── .gitignore
├── README.md
```

## 🚀 Requisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL
- pip, npm o yarn

## ⚙️ Configuración del backend (Django)

1. Crear y activar entorno virtual:

```bash
python -m venv env
source env/bin/activate      # En Windows: env\Scripts\activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Crear archivo `.env` (opcional) y configurar conexión a PostgreSQL:

```env
DJANGO_SECRET_KEY=tu_clave
DB_NAME=nombre_db
DB_USER=usuario
DB_PASSWORD=clave
DB_HOST=localhost
DB_PORT=5432
```

4. Aplicar migraciones y crear superusuario:

```bash
python manage.py migrate
python manage.py createsuperuser
```

5. Ejecutar servidor:

```bash
python manage.py runserver
```

## 🖥️ Configuración del frontend (React)

1. Entrar a la carpeta `frontend`:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
# o yarn
```

3. Ejecutar app:

```bash
npm run dev
# o yarn dev
```

## 🔐 Autenticación y Roles

- Usa JWT para autenticación de usuarios.
- Dos roles:
  - **Administrador:** puede crear, editar, eliminar.
  - **Externo:** solo lectura.

## 🧩 Funcionalidad adicional

- **IA:** Clasifica automáticamente productos por características.
- **Blockchain:** Registro inmutable de eventos de inventario simulado con hashes.

## 📝 TODOs

- [ ] Implementar envío de PDF por email
- [ ] Mejorar estilos en React (Tailwind, ShadCN, etc.)
- [ ] Despliegue (Docker o Vercel + Railway)

## 📄 Licencia

MIT - Henry Jiménez © 2025
