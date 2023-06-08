import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const FlagContext = createContext();

export const FlagProvider = ({ children }) => {
  const [flagCountry, setFlagCountry] = useState([]);
  const nationalityToFlagCode = {
    British: 'GB',
    UK: 'GB',
    Korea: 'KR',
    UAE: 'AE',
    Dutch: 'NL',
    Monegasque: 'MC',
    'New Zealander': 'NZ',
    Russia: 'RU',
    USA: 'US',
    Rhodesian: 'ZW',
    Liechtensteiner: 'LI',
    Hungarian: 'HU',
  };

  useEffect(() => {
    const getFlagData = async () => {
      try {
        const url =
          'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json';
        const res = await axios.get(url);
        setFlagCountry(res.data);
      } catch (error) {
        console.log('Error fetching country codes:', error);
      }
    };
    getFlagData();
  }, []);

  const getFlagCode = (nationality) => {
    const filteredFlags = flagCountry.filter(
      (flag) =>
        flag.nationality === nationality || flag.en_short_name === nationality
    );
    if (filteredFlags.length > 0) {
      return filteredFlags[0]?.alpha_2_code;
    } else {
      return nationalityToFlagCode[nationality] || '';
      
    }
    
  };
  


  const contextValue = {
    flagCountry,
    getFlagCode,
    
  };

  return (
    
    <FlagContext.Provider value={contextValue}>{children}</FlagContext.Provider>
  );
  
};
