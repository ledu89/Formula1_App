import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const YearContext = createContext();

export const YearProvider = ({ children }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const getYearsData = async () => {
      try {
        const response = await axios.get(
          'https://ergast.com/api/f1/seasons.json?limit=80'
        );
        const yearsData = response.data.MRData.SeasonTable.Seasons.reverse();
        setYears(yearsData);
        setSelectedYear(yearsData[0].season);
      } catch (error) {
        console.log('Error fetching years:', error);
      }
    };
    getYearsData();
  }, []);

  const contextValue = {
    years,
    selectedYear,
    setSelectedYear,
  };

  return (
    <YearContext.Provider value={contextValue}>{children}</YearContext.Provider>
  );
};
