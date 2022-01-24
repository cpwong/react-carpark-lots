const axios = require('axios');

export const API = axios.create({
  baseURL:'https://api.data.gov.sg/v1'
});

export const API2 = axios.create({
  baseURL:'https://data.gov.sg/'
});
