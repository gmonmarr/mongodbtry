# Pre-requisitos
- Tener un servidor / servicio local de mongodb
- Tener un servidor / servicio local de MySQL

# Pasos para correr
1. Instalar paquetes
```bash
npm i
```

2. Llenar env
3. Correr los archivos de pruebas
```bash
node scripts/seedEventsMongo.js n # reemplazar n con un número, ej. 300
node scripts/seedEventsMySQL.js n # reemplazar n con un número, ej. 300

node scripts/readEventsMongo.js
node scripts/readEventsMySQL.js
```
seedEvents* es para insertar a la base de datos <br>
readEvents* es para leer de la base de datos
