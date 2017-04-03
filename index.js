var express = require('express');
var products = require('./data/products.json');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/public'));
app.post('/contact', function(req, res) {
  console.log(req.body);
  res.redirect('/');
});

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  console.log(req.params);
  console.log(res.params);
  res.render('index', {
    title: 'Mini App',
    activeMainMenu: {
      about: '',
      contact: ''
    },
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
  res.render('product', {
    title: 'Mini App - product',
    products: products,
    activeMainMenu: {
      product: 'active',
      about: '',
      contact: ''
    },
  });
});

app.get('/order', function(req, res) {
  console.log('req.query = ', req.query);
  var product = products.find(function(product) {
    return product.id === req.query.id;
  });
  console.log('show product = ', product);
  res.render('order', {
    title: 'Mini App - product / order',
    product: product,
    activeMainMenu: {
      product: '',
      about: '',
      contact: ''
    },
  });
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

app.post('/order/:id', function(req, res) {
  console.log(req.params);
  console.log(req.body);
  res.redirect('/thanks');
});

app.listen(3300, function() {
  console.log('Starting mini application');
});
