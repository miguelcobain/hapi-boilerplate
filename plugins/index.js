module.exports = [
  //set up good to log every kind of event. Change according to your needs.
  {
    register:require('good'),
    options:{
      reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', request: '*', ops: '*', error: '*' }]
      }]
    }
  }
  //require additional plugins here
];
