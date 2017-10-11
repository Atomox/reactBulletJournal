var express = require('express');
var app = express();
var server = require('http').createServer(app);

/**
app.use(express.static(__dirname + '/includes'));
*/

let r = require('rethinkdb');
let settings = require('./settings.js');
let db_name = settings.db.name;

// Connect to the DB.
r.connect({ host: settings.db.host, port: settings.db.port }, function(err, conn) {
  if (err) { 
    console.error('Check your host and port. Did you expose the port?');
    throw err; 
  }

  // Select all rows in the table.
  r.db(db_name).table('tv_shows')
    .run(conn)
    .then((cursor) => {
      cursor.toArray((err, result) => {
        if (err) { throw err; }
        console.log(JSON.stringify(result, null, 2));
      });
    })
    .catch((err) => {
      console.error(err);
    });
});


let lists = [
      { id: 1,
        title: 'Lake Destiny',
        items: [
          { label: "get keys",
            type: 'minor',
            id: 1,
            done: false,
          },
          { label: "get soup",
            type: 'minor',
            id: 2,
            done: false,
          },
          { label: "heat soup",
            type: 'minor',
            id: 3,
            done: false,
          },
          { label: "bond with Max",
            type: 'major',
            id: 4,
            done: false,
          },
        ],
        nextItemId: 5,
      },
      { id: 2,
        title: 'Powerline Concert',
        items: [
          { label: "Give Max a choice",
            type: 'minor',
            id: 1,
            done: false,
          },
          { label: "Get mad",
            type: 'minor',
            id: 2,
            done: false,
          },
          { label: "Car Rolls Away",
            type: 'scheduled',
            id: 3,
            done: false,
          },
          { label: "Bond with Max",
            type: 'migrated',
            id: 4,
            done: false,
          },
        ],
        nextItemId: 5,
      },
      { id: 3,
        title: 'None Yet',
        items: [ ],
        nextItemId: 0,
      },
      {
        id: 4,
        title: 'Buellet Journal',
        items: [
        {
          label: 'List displaying items and icons for status/type',
          type: 'minor',
          id: 1,
          done: true,
        },
        {
          label: 'Multiple lists',
          type: 'minor',
          id: 2,
          done: true,
        },
        {
          label: 'Add items to lists',
          type: 'minor',
          id: 3,
          done: true,
        },
        {
          label: 'Update status of list items.',
          type: 'minor',
          id: 4,
          done: true,
        },
        {
          label: 'Toggle complete status.',
          type: 'minor',
          id: 5,
          done: true,
        },
        {
          label: 'Delete item option.',
          type: 'minor',
          id: 6,
          done: false,
        },
        {
          label: 'Load list from backend.',
          type: 'minor',
          id: 7,
          done: true,
        },
        {
          label: 'Setup ReTHINKDB on server.',
          type: 'major',
          id: 8,
          done: false,
        },
        {
          label: 'Look into rethinkdbdash',
          type: 'minor',
          id: 10,
          done: false,
        },
        {
          label: 'Store lists in backend.',
          type: 'minor',
          id: 9,
          done: false,
        },
        ],
      }
    ];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/list/:id', function(req, resp, next) {
  console.log('List time!');
  let payload = false;

  if (req.params.id) {
    let reqId = lists.findIndex((obj => obj.id == req.params.id));

  	if (reqId >= 0) {
    	payload = lists[reqId];
  	}
  }
  
  resp.json(payload);
});
app.get('/lists', function(req, resp, next) {
  console.log('List time!');
  resp.json(lists);
});

server.listen('8383');
