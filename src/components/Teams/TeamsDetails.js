import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import FormulaAxios from '../../apis/FormulaAxios';
import Flag from 'react-flagkit';
import './TeamsDetails.css';
import { RiShareBoxLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import { FlagContext } from '../../contexts/FlagContext';
import { YearContext } from '../../contexts/YearContext';
import Breadcrumbs from '../Breadcrumbs';
import azerbaijanFlag from '../../assets/azerbaijanFlag.png';

const TeamsDetails = () => {
  const { getFlagCode } = useContext(FlagContext);
  const { selectedYear } = useContext(YearContext);
  const [teamsDetails, setTeamsDetails] = useState([]);
  const [teamsResults, setTeamsResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const getTeamsDetails = async () => {
      try {
        const responseStandings = await FormulaAxios.get(
          `/${selectedYear}/constructors/${id}/constructorStandings.json`
        );
        const responseResults = await FormulaAxios.get(
          `/${selectedYear}/constructors/${id}/results.json`
        );
        const standings =
          responseStandings.data?.MRData?.StandingsTable?.StandingsLists;
        const results = responseResults.data?.MRData?.RaceTable?.Races;

        const details = standings[0]?.ConstructorStandings;
        setTeamsDetails(details);
        setTeamsResults(results);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getTeamsDetails();
  }, [id, selectedYear]);

  const items = [
    {
      href: '/teams',
      title: 'Teams',
    },
    {
      href: '',
      title: teamsDetails[0]?.Constructor.name,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='details-container'>
      <Breadcrumbs items={items} />

      <div className='driver-team-details'>
        <div className='details-info' key={teamsDetails[0].Constructor.name}>
          <div className='driver-team-info'>
            <img
              className='driver-team-avatar'
              src={`../../assets/${teamsDetails[0].Constructor.constructorId}.png`}
              alt='Team logo'
            />
            <Flag
              className='flag-icon'
              country={getFlagCode(teamsDetails[0].Constructor.nationality)}
            />
            <p className='driver-team-name'>
              {teamsDetails[0].Constructor.name}
            </p>
          </div>
          <div className='aditional-info'>
            <div className='aditional-info-left'>
              <p>
                <span className='aditional-info-label'>Country:</span>
                {teamsDetails[0].Constructor.nationality}
              </p>
              <p>
                <span className='aditional-info-label'>Position:</span>
                {teamsDetails[0].position}
              </p>
              <p>
                <span className='aditional-info-label'>Points:</span>
                {teamsDetails[0].points}
              </p>
              <p>
                <span className='aditional-info-label'>History:</span>
                <Link
                  to={teamsDetails[0].Constructor.url.concat('#', 'History')}
                  target='blank'
                >
                  <RiShareBoxLine className='share-icon' size={15} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='details-table-container'>
        <table className='team-detail-table'>
          <caption>Formula 1 {selectedYear} Results</caption>
          <thead>
            <tr>
              <th>Round</th>
              <th>Grand Prix</th>
              <th>{teamsResults[0]?.Results[0].Driver.familyName}</th>
              <th>{teamsResults[0]?.Results[1]?.Driver.familyName}</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {teamsResults.map((result) => {
              const driver1 = result.Results[0];
              const driver2 = result.Results[1];

              const position1 = driver1 ? driver1.position : '-';
              const position2 = driver2 ? driver2.position : '-';
              const points1 = driver1 ? driver1.points : 0;
              const points2 = driver2 ? driver2.points : 0;
              const totalPoints = Number(points1) + Number(points2);

              return (
                <tr key={result.round}>
                  <td>{result.round}</td>
                  <td>
                    <div className='details-race'>
                      
                      {getFlagCode(result.Circuit.Location.country) === 'AZ' ? (
                        <img
                          src={azerbaijanFlag}
                          alt='Azerbaijan Flag'
                          className='flag-az'
                        />
                      ) : (
                        <Flag
                          className='flag-icon'
                          country={getFlagCode(result.Circuit.Location.country)}
                        />
                      )}
                      <Link className='link' to={`/races/${result.round}`}>
                        {result.raceName}
                      </Link>
                    </div>
                  </td>
                  <td className={`default-background position-${position1}`}>
                    {position1}
                  </td>
                  <td className={`default-background position-${position2}`}>
                    {position2}
                  </td>
                  <td>{totalPoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TeamsDetails;
