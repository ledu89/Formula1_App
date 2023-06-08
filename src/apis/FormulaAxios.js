import axios from 'axios';

const FormulaAxios = axios.create({
  baseURL: 'https://ergast.com/api/f1',
});

export default FormulaAxios;
