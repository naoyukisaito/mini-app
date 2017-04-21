var express = require('express');
// var products = require('./data/products.json');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var connection = require('./mysqlConnection');
// console.log(connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.post('/contact', function(req, res) {
  // console.log(req.body);
  res.redirect('/');
});

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  // console.log(req.params);
  // console.log(res.params);
  if (req.session.user_id) {
    console.log(req.session.user_id);
  } else {
    console.log('session failed');
  }
  res.render('index', {
    title: 'Mini App',
    activeMainMenu: {
      about: '',
      contact: ''
    },
  });
});

app.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var query = 'SELECT user_id FROM users WHERE email = "' + email + '" AND password = "' + password + '" LIMIT 1';
  connection.query(query, function(err, rows) {
    var userId = rows.length? rows[0].user_id: false;
    console.log(userId);
    console.log(req.session);
    if (userId) {
      req.session.user_id = userId;
      res.redirect('/');
    } else {
      res.render('/index', {
        title: 'ログイン',
        noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
      });
    }
  });
});

app.get('/register', function(req, res) {
  // console.log(req.params);
  // console.log(res.params);
  res.render('register', {
    title: '新規会員登録',
    activeMainMenu: {
      about: '',
      contact: ''
    },
  });
});

app.post('/register', function(req, res) {
  var userName = req.body.user_name;
  var email = req.body.email;
  // console.log(req.body.email);/
  var password = req.body.password;
  var emailExistsQuery = 'SELECT * FROM users WHERE email = "' + email + '" LIMIT 1';
  var registerQuery = 'INSERT INTO users (user_name, email, password) VALUES ("' + userName + '", ' + '"' + email + '", ' + '"' + password + '")';

  connection.query(emailExistsQuery, function(err, email) {

    var emailExists = email.length === 1;
    // console.log(emailExists);
    if (emailExists) {
      // console.log('exist!!');
      res.render('register', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです',
        activeMainMenu: {
          about: '',
          contact: '',
          product: ''
        },
      });
    } else {
      connection.query(registerQuery, function(err, rows) {
        res.redirect('/');
      });
    }
  });
});

app.get('/about', function(req, res) {
  res.render('about', {
    title: 'Mini App - about us',
    activeMainMenu: {
      about: 'active',
      contact: ''
    },
  });
});

app.get('/contact', function(req, res) {
  res.render('contact', {
    title: 'Mini App - contact us',
    activeMainMenu: {
      about: '',
      contact: 'active'
    },
  });
});

app.get('/product', function(req, res) {
  connection.query('SELECT * FROM product_detail', function(err, rows, fields) {
    // console.log(rows);
    res.render('product', {
      title: 'Mini App - product',
      products: rows,
      activeMainMenu: {
        product: 'active',
        about: '',
        contact: ''
      },
    });
  })
});


app.get('/order', function(req, res) {
  connection.query('SELECT * FROM product_detail', function(err, rows) {
    // console.log(rows.id);
  // console.log('req.query = ', req.query);
    // var product = rows.find(function(row) {
    //     console.log(row.length);
    //     // console.log(req.query.id);
    //   return row.id === req.query.id;
    // });
    var product = rows[req.query.id - 1];
    // console.log(product);

    res.render('order', {
      title: 'Mini App - product / order',
      product: product,
      activeMainMenu: {
        product: '',
        about: '',
        contact: ''
      },
    });
  })
});



app.get('/thanks', function(req, res) {
  res.render('thanks', {
    title: 'Thank',
    activeMainMenu: {
      about: '',
      contact: ''
    },
  });
});

// app.get('/')

app.post('/order/:id', function(req, res) {
  // console.log(req);
  // console.log('ls');
  var query = 'INSERT INTO user_info (name, email) VALUES ("' + req.body.name + '", ' + '"' + req.body.email + '")';
  connection.query(query, function(err, rows) {
    res.redirect('/thanks');
  });

});

app.listen(3300, function() {
  console.log('Starting mini application');
});
