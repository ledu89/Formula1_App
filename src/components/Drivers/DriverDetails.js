import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import FormulaAxios from '../../apis/FormulaAxios';
import './DriverDetails.css';
import Flag from 'react-flagkit';
import { RiShareBoxLine } from 'react-icons/ri';
import './DriverDetails.css';
import Loader from '../Loader';
import { FlagContext } from '../../contexts/FlagContext';
import { YearContext } from '../../contexts/YearContext';
import Breadcrumbs from '../Breadcrumbs';
import azerbaijanFlag from '../../assets/azerbaijanFlag.png';

const DriverDetails = () => {
	const { getFlagCode } = useContext(FlagContext);
	const { selectedYear } = useContext(YearContext);
	const [driverDetails, setDriverDetails] = useState([]);
	const [seasonDetails, setSeasonDetails] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const avatarUrl = '../../assets/avatar.png';

	const { id } = useParams();

	useEffect(() => {
		const getDriverDetails = async () => {
			const res = await FormulaAxios.get(
				`/${selectedYear}/drivers/${id}/driverStandings.json`
			);
			const response = await FormulaAxios.get(
				`/${selectedYear}/drivers/${id}/results.json`
			);

			const details =
				res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
			const detailsSeason = response.data.MRData.RaceTable.Races;

			setDriverDetails(details);
			setSeasonDetails(detailsSeason);

			setIsLoading(false);
		};
		getDriverDetails();
	}, [id, selectedYear]);

	const items = [
		{
			href: '/drivers',
			title: 'Drivers',
		},
		{
			href: '',
			title: `${driverDetails[0]?.Driver?.givenName} ${driverDetails[0]?.Driver?.familyName}`,
		},
	];

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className='details-container'>
			<Breadcrumbs items={items} />
			<div className='driver-team-details'>
				<div className='details-info' key={driverDetails[0].position}>
					<div className='driver-team-info'>
						<img
							className='driver-team-avatar'
							src={`../../assets/${driverDetails[0].Driver.driverId}.jpg`}
							alt=''
							onError={(e) => {
								e.target.src = avatarUrl;
								e.target.alt = 'Avatar';
							}}
						/>
						<div className='driver'>
							<Flag
								country={getFlagCode(driverDetails[0].Driver.nationality)}
								className='flag-icon'
							/>
							<p className='driver-team-name'>
								{driverDetails[0].Driver.givenName}
								{driverDetails[0].Driver.familyName}
							</p>
						</div>
					</div>
					<div className='aditional-info'>
						<div className='aditional-info-left'>
							<p>
								<span className='aditional-info-label'>Country:</span>
								{driverDetails[0].Driver.nationality}
							</p>
							<p>
								<span className='aditional-info-label'>Team:</span>
								{driverDetails[0].Constructors[0].name}
							</p>
							<p>
								<span className='aditional-info-label'>Birth:</span>
								{driverDetails[0].Driver.dateOfBirth}
							</p>
							<p>
								<span className='aditional-info-label'>Biography:</span>
								<Link target='blank' to={driverDetails[0].Driver.url}>
									<RiShareBoxLine className='share-icon' size={15} />
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='details-table-container'>
				<table className='driver-detail-table'>
					<caption>Formula 1 {selectedYear} Results</caption>
					<thead>
						<tr>
							<th>Round</th>
							<th>Grand Prix</th>
							<th>Team</th>
							<th>Grid</th>
							<th>Race</th>
						</tr>
					</thead>
					<tbody>
						{seasonDetails.map((season) => {
							return (
								<tr key={season.round}>
									<td>{season.round}</td>
									<td>
										<div className='details-race'>
											{getFlagCode(season.Circuit.Location.country) === 'AZ' ? (
												<img
													src={azerbaijanFlag}
													alt='Azerbaijan Flag'
													className='flag-az'
												/>
											) : (
												<Flag
													className='flag-icon'
													country={getFlagCode(season.Circuit.Location.country)}
												/>)}
												<Link to={`/races/${season.round}`} className= 'link'>
											{season.raceName}
												</Link>
											
										</div>
									</td>
									<td>
										<Link
											to={`/teams/${season.Results[0].Constructor.constructorId}`}
											className='link'
										>
											{season.Results[0].Constructor.name}
										</Link>
									</td>
									<td>{season.Results[0].grid}</td>
									<td
										className={`default-background position-${season.Results[0].position}`}
									>
										{season.Results[0].position}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default DriverDetails;
