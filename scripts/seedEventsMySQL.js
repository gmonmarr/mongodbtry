const mysql = require('mysql2/promise');
require('dotenv').config();
const { faker } = require('@faker-js/faker');

const NUM_EVENTS = parseInt(process.argv[2]) || 30;

const run = async () => {
  const startTime = Date.now();

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'globalticket'
    });

    console.log('✅ Connected to MySQL');

    // === Clear old data (in order) ===
    await connection.execute('DELETE FROM tbl_admision');
    await connection.execute('DELETE FROM tbl_fecha_evento');
    await connection.execute('DELETE FROM tbl_evento');
    await connection.execute('DELETE FROM tbl_recintos');
    await connection.execute('DELETE FROM tbl_propietario');

    let fechaId = 1;
    let admisionId = 1;

    for (let i = 1; i <= NUM_EVENTS; i++) {
      // 1. Insert propietario
      const [prop] = await connection.execute(
        `INSERT INTO tbl_propietario (idPropietario, Nombre, RFC, TelefonoContacto, EmailContacto)
         VALUES (?, ?, ?, ?, ?)`,
        [
          i,
          faker.company.name(),
          faker.string.alphanumeric(13).toUpperCase(),
          faker.phone.number('+52 81 ### ####'),
          faker.internet.email()
        ]
      );

      // 2. Insert recinto
      const [rec] = await connection.execute(
        `INSERT INTO tbl_recintos (idRecinto, idUbicacion, idPropietario, Nombre, Aforo, AdmiteNumerado)
         VALUES (?, NULL, ?, ?, ?, ?)`,
        [
          i,
          i, // same propietario
          faker.company.name() + ' Arena',
          faker.number.int({ min: 500, max: 10000 }),
          faker.datatype.boolean()
        ]
      );

      // 3. Insert evento
      await connection.execute(
        `INSERT INTO tbl_evento (idEvento, idPropietario, idRecinto, Nombre, LogoUrl)
         VALUES (?, ?, ?, ?, ?)`,
        [
          i,
          i,
          i,
          faker.music.songName() + ' Live',
          faker.image.urlLoremFlickr({ category: 'concert' })
        ]
      );

      // 4. Insert 1-3 fechas
      const numFechas = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numFechas; j++) {
        const thisFechaId = fechaId++;
        await connection.execute(
          `INSERT INTO tbl_fecha_evento (idFechaEvento, idEvento, Fecha, Hora)
           VALUES (?, ?, ?, ?)`,
          [
            thisFechaId,
            i,
            faker.date.future().toISOString().split('T')[0],
            `${faker.number.int({ min: 18, max: 22 })}:00:00`
          ]
        );

        // 5. Insert 2 admisiones per fecha
        await connection.execute(
          `INSERT INTO tbl_admision (idAdmision, idFechaEvento, Nombre, Precio, UrlLogo)
           VALUES (?, ?, ?, ?, ?)`,
          [
            admisionId++,
            thisFechaId,
            'General',
            faker.number.int({ min: 500, max: 1500 }),
            faker.image.avatar()
          ]
        );

        await connection.execute(
          `INSERT INTO tbl_admision (idAdmision, idFechaEvento, Nombre, Precio, UrlLogo)
           VALUES (?, ?, ?, ?, ?)`,
          [
            admisionId++,
            thisFechaId,
            'VIP',
            faker.number.int({ min: 1500, max: 3500 }),
            faker.image.avatar()
          ]
        );
      }
    }

    const endTime = Date.now();

    console.log(`✅ Inserted ${NUM_EVENTS} full event trees`);
    console.log(`⏱️  Time taken: ${(endTime - startTime)} ms (${((endTime - startTime) / 1000).toFixed(2)} seconds)`);

    await connection.end();
  } catch (err) {
    console.error('❌ Error during MySQL seed:', err);
    process.exit(1);
  }
};

run();
