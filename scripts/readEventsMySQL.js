const mysql = require('mysql2/promise');
require('dotenv').config();

const run = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    console.log('✅ Connected to MySQL');

    const start = Date.now();

    const [rows] = await connection.execute(`
      SELECT 
        e.idEvento, e.Nombre AS eventoNombre, e.LogoUrl,
        p.Nombre AS propietarioNombre, p.RFC, p.EmailContacto,
        r.Nombre AS recintoNombre, r.Aforo,
        f.idFechaEvento, f.Fecha, f.Hora,
        a.Nombre AS admNombre, a.Precio, a.UrlLogo
      FROM tbl_evento e
      JOIN tbl_propietario p ON e.idPropietario = p.idPropietario
      JOIN tbl_recintos r ON e.idRecinto = r.idRecinto
      LEFT JOIN tbl_fecha_evento f ON e.idEvento = f.idEvento
      LEFT JOIN tbl_admision a ON f.idFechaEvento = a.idFechaEvento
    `);

    const end = Date.now();

    const uniqueEvents = new Set(rows.map(row => row.idEvento));

    console.log(`✅ Read ${uniqueEvents.size} events`);
    console.log(`⏱️  Time taken: ${end - start} ms (${((end - start) / 1000).toFixed(2)} seconds)`);

    await connection.end();
  } catch (err) {
    console.error('❌ MySQL Read Error:', err);
    process.exit(1);
  }
};

run();
