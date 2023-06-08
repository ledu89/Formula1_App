import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import Flag from 'react-flagkit';
import { FlagContext } from '../../contexts/FlagContext';
import { YearContext } from '../../contexts/YearContext';
import FormulaAxios from '../../apis/FormulaAxios';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchRaces } from '../Helper';
import Breadcrumbs from '../Breadcrumbs';
import azerbaijanFlag from '../../assets/azerbaijanFlag.png';


const Races = () => {
  const { selectedYear } = useContext(YearContext);
  const { getFlagCode } = useContext(FlagContext);
  const [allRaces, setAllRaces] = useState([]);
  const [search, setSerach] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllRaces = async () => {
      try {
        const res = await FormulaAxios.get(`/${selectedYear}/results/1.json`);
        setAllRaces(res.data.MRData.RaceTable.Races);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching races:', error);
        setIsLoading(false);
      }
    };
    getAllRaces();
  }, [selectedYear]);

  const searchData = searchRaces(allRaces, search);

  const handleSearch = (e) => {
    setSerach(e.target.value);
  };

  const items = [
    {
      href: '',
      title: 'Races',
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='container'>
      <Breadcrumbs items={items} />
      <h1 className='main-title'>Race Calendar</h1>
      <Input
        className='search-input'
        placeholder='Search...'
        prefix={<SearchOutlined />}
        onChange={handleSearch}
      />
      <div className='table-wrapper'>
        <table>
          <caption>Race Calendar - {selectedYear}</caption>
          <thead>
            <tr>
              <th>Round</th>
              <th>Grand Prix</th>
              <th>Circuit</th>
              <th>Date</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {searchData.map((race) => (

              <tr key={race.round}>
                <td>{race.round}</td>
                <td>
                  <Link className='link' to={`/races/${race.round}`}>
                    {getFlagCode(race.Circuit.Location.country) === 'AZ' ? (
                      <img
                        src={azerbaijanFlag}
                        alt='Azerbaijan Flag'
                        className='flag-az'
                      />
                    ) : (
                      <Flag
                        className='flag-icon'
                        country={getFlagCode(race.Circuit.Location.country)}
                      />
                    )}
                    {race.raceName}
                  </Link>
                </td>
                <td>{race.Circuit.circuitName}</td>
                <td className='race-date'>{race.date}</td>
                <td>
                  <div className='winner-details'>
                    <Flag
                      className='flag-icon'
                      country={getFlagCode(race.Results[0].Driver.nationality)}
                    />
                    <Link
                      to={`/drivers/${race.Results[0].Driver.driverId}`}
                      className='link'
                    >
                      {race.Results[0].Driver.familyName}
                    </Link>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Races;
