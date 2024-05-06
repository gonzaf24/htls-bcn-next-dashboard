// This file contains placeholder data that we'll be replacing with real data in the Data Fetching
const { bars_places } = require('./Bar');
const { bars_subcategories } = require('./Bar');
const { entertainment_subcategories } = require('./Entertainment');
const { entertainment_places } = require('./Entertainment');
const { food_subcategories } = require('./Food');
const { food_places } = require('./Food');

const places = [...food_places, ...bars_places, ...entertainment_places];

const categories = [
  {
    id: 1,
    name: 'Food',
    t_name: 'cat_food',
    icon: 'food.svg',
  },
  {
    id: 2,
    name: 'Bar',
    t_name: 'cat_bar',
    icon: 'bar.svg',
  },
  {
    id: 3,
    name: 'Entertainment',
    t_name: 'cat_entertainment',
    icon: 'entertainment.svg',
  },
];

const subcategories = [
  ...food_subcategories,
  ...bars_subcategories,
  ...entertainment_subcategories,
];

module.exports = {
  categories,
  subcategories,
  places,
};
