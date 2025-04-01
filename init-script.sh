#!/bin/bash

echo "🚀 Iniciando configuración del entorno de desarrollo para DERMOFARM..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instale Node.js v18 o superior."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d "v" -f 2 | cut -d "." -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js v18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📄 Creando archivo de configuración .env..."
    cp .env.example .env
    echo "⚠️  Por favor, configure las variables en el archivo .env"
fi

# Crear carpeta de logs
echo "📁 Creando estructura de directorios..."
mkdir -p logs

# Verificar si la base de datos SQLite existe
if [ ! -f dermofarm-dev.sqlite ]; then
    echo "🗄️  Creando base de datos SQLite para desarrollo..."
    touch dermofarm-dev.sqlite
fi

# Compilar el proyecto
echo "🔨 Compilando el proyecto..."
npm run build

echo "
✨ Configuración completada ✨

Para iniciar el servidor en modo desarrollo:
  npm run start:dev

Para acceder a la documentación de la API:
  http://localhost:3000/api

Para más información, consulte:
  documentation/QUICKSTART.md
"

