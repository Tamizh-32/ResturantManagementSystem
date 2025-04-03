const exphbs = require('express-handlebars');
const path = require('path');

const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    includes: function (array, value) {
      if (!Array.isArray(array)) return false;
      return array.some((item) => item._id.toString() === value.toString());
    },
    includesByName: function (array, value) {
      if (!Array.isArray(array)) return false;
      return array.some((item) => item.name === value);
    },
    inc: function (value) {
      return parseInt(value) + 1;
    },
    eq: function (a, b) {
      return (a && b ? a.toString() === b.toString() : false);
    },
    json: function (context) {
      return JSON.stringify(context);
    },
    getIcon: function (menuName) {
      const iconMap = {
        Dashboard: 'fas fa-tachometer-alt',
        Tables: 'fas fa-table',
        'Table Status': 'fas fa-tasks',
        Category: 'fas fa-tags',
        Menus: 'fas fa-box-open',
        Orders: 'fas fa-shopping-cart',
        'Order Status': 'fas fa-receipt',
        Store: 'fas fa-store',
        'Routing Menus': 'fas fa-list',
        Role: 'fas fa-user-shield',
        'Company Info': 'fas fa-info-circle',
        Users: 'fas fa-users',
      };
      return iconMap[menuName] || 'fas fa-question-circle';
    },
  },
  defaultLayout: 'layout',
  loginDir: 'views/',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

module.exports = hbs;