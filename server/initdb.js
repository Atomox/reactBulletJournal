let r = require('rethinkdb');
let settings = require('./settings.js');
let db_name = settings.db.name;

r.connect({ host: settings.db.host, port: settings.db.port })
  .then((conn) => {

    /**
       @TODO
     */
    // For each settings.db.tables

      // Check if table exists
      // If not, create it
      // Enter some sample data. 


    // Drop table if it exists.
    let tblDrop = r.db(db_name).tableDrop('tv_shows').run(conn);

    tblDrop.then((result) => {
      // Check if table exists
      r.db(db_name).tableList().run(conn)
        .then((result) => {
          return (result.indexOf('tv_shows') >= 0) 
            ? Promise.reject('Table already exists.')
            : Promise.resolve('Table does not exist. Creating...');
        })

        // Create a table, and add some data.
        .then((result) => {
          r.db(db_name).tableCreate('tv_shows').run(conn)

            // Insert some sample data.
            .then((res) => {
              r.table('tv_shows').insert([
                { name: 'Star Trek TNG' },
                { name: 'Battlestar Galactica', episodes: 75}
                ]).run(conn)
                
                // Log success.
                .then((res) => {
                  console.log('Insert', res);
                });
            });

        })
        .catch((err) => {
          console.log('Error: ', err);
          process.exit();
        });       
    });
  })
  .catch((err) => {
    console.error('Check your host and port. Did you expose the port? Err: ', err);
    throw err; 
  });