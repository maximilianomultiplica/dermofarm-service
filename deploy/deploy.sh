#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] ${1}${NC}"
}

print_message "Iniciando despliegue de Dermofarm API..." "$BLUE"

# Verificar que docker está instalado
if ! command -v docker &> /dev/null; then
    print_message "Error: Docker no está instalado. Por favor, instala Docker antes de continuar." "$RED"
    exit 1
fi

# Verificar que docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_message "Error: Docker Compose no está instalado. Por favor, instala Docker Compose antes de continuar." "$RED"
    exit 1
fi

# Verificar que el archivo .env.prod existe
if [ ! -f .env.prod ]; then
    print_message "Error: El archivo .env.prod no existe en el directorio actual." "$RED"
    print_message "Creando archivo .env.prod de ejemplo..." "$YELLOW"
    cat > .env.prod << EOF
# Server Configuration
PORT=3000
NODE_ENV=production
IS_DOCKER=true

# Database Configuration - SQL Server (for Docker)
DB_HOST=sqlserver
DB_PORT=1433
DB_NAME=dermofarm
DB_USER=sa
DB_PASSWORD=StrongProductionPassword!

# Dermofarm API 
DERMOFARM_API_URL=http://api.dermofarm.com

# JWT Configuration
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRATION=24h
EOF
    print_message "Archivo .env.prod creado. Por favor, edita este archivo con los valores correctos y vuelve a ejecutar este script." "$GREEN"
    exit 1
fi

# Cargar variables de entorno
print_message "Cargando variables de entorno..." "$YELLOW"
set -a
source .env.prod
set +a

# Construir la imagen
print_message "Construyendo imagen de producción..." "$YELLOW"
docker-compose --env-file .env.prd -f docker-compose.prod.yml -p agent2 build --no-cache

# Si hubo un error en la construcción, salir
if [ $? -ne 0 ]; then
    print_message "Error: Falló la construcción de la imagen. Verifica los logs para más detalles." "$RED"
    exit 1
fi

# Iniciar los servicios
print_message "Iniciando servicios..." "$YELLOW"
docker-compose --env-file .env.prd -f docker-compose.prod.yml -p agent2 up -d

# Si hubo un error al iniciar los servicios, salir
if [ $? -ne 0 ]; then
    print_message "Error: Falló el inicio de los servicios. Verifica los logs para más detalles." "$RED"
    exit 1
fi

# Verificar el estado de los servicios
print_message "Verificando estado de los servicios..." "$YELLOW"
docker-compose --env-file .env.prd -f docker-compose.prod.yml -p agent2 ps

# Verificar que el servicio API está en ejecución
if ! docker ps | grep -q dermofarm-api-prod; then
    print_message "Error: El servicio API no está en ejecución. Verifica los logs para más detalles." "$RED"
    docker-compose --env-file .env.prd -f docker-compose.prod.yml -p agent2 logs api
    exit 1
fi

# Esperar a que el servicio esté disponible
print_message "Esperando a que el servicio esté disponible..." "$YELLOW"
attempts=0
max_attempts=30
until $(curl --output /dev/null --silent --head --fail http://localhost:${PORT:-3000}/api) || [ $attempts -eq $max_attempts ]; do
    attempts=$((attempts+1))
    print_message "Intento $attempts de $max_attempts. Esperando 5 segundos..." "$YELLOW"
    sleep 5
done

if [ $attempts -eq $max_attempts ]; then
    print_message "Error: El servicio no está disponible después de $max_attempts intentos. Verifica los logs para más detalles." "$RED"
    docker-compose --env-file .env.prd -f docker-compose.prod.yml -p agent2 logs api
    exit 1
fi

print_message "¡Despliegue completado con éxito!" "$GREEN"
print_message "API disponible en: http://localhost:${PORT:-3000}/api" "$GREEN"
print_message "Para ver los logs, ejecuta: docker-compose -f docker-compose.prod.yml logs -f" "$BLUE"