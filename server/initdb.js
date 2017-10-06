let r = require('rethinkdb');
let settings = require('./settings.js');

r.connect({ host: settings.db.host, port: settings.db.port }, function(err, conn) {
  if (err) { 
    console.error('Check your host and port. Did you expose the port?');
    throw err; 
  }

  r.db('test').tableCreate('tv_shows').run(conn, function(err, res) {
    if (err) { throw err; }
    
    console.log(res);
    

    /**
     * @todo 
     *   Abstract the schema definition.
     */

    r.table('tv_shows').insert([
      { name: 'Star Trek TNG' },
      { name: 'Battlestar Galactica', episodes: 75}
      ]).run(conn, function(err, res)
    {
      if(err) throw err;
      console.log('Insert', res);
    });
  });

});