import React, { useContext } from 'react';
import { YearContext } from '../../contexts/YearContext';

const Home = () => {
  const { years, selectedYear, setSelectedYear } = useContext(YearContext);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
  };
  return (
    <div className='home-page'>
      <div className='year-selector'>
        <label htmlFor='year'>Select Year:</label>
        <select
          className='select'
          id='year'
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year.season} value={year.season}>
              {year.season}
            </option>
          ))}
        </select>
      </div>
      <img src='/assets/f1HomePage.jpg' alt='Home page' />
    </div>
  );
};
export default Home;
