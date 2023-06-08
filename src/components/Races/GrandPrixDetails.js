import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import FormulaAxios from '../../apis/FormulaAxios';
import { RiShareBoxLine } from 'react-icons/ri';
import Loader from '../Loader';
import './GrandPrixDetail.css';
import Flag from 'react-flagkit';
import { YearContext } from '../../contexts/YearContext';
import { FlagContext } from '../../contexts/FlagContext';
import ErrorModal from '../UI/ErrorModal';
import Breadcrumbs from '../Breadcrumbs';
import azerbaijanFlag from '../../assets/azerbaijanFlag.png';

const GrandPrixDetails = () => {
	const { selectedYear } = useContext(YearContext);
	const { getFlagCode } = useContext(FlagContext);

	const [qualifiers, setQualifiers] = useState([]);
	const [raceResults, setRaceResults] = useState([]);
	const [grandPrixDetails, setGrandPrixDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const { id } = useParams();

	useEffect(() => {
		setError(null);
		const getRaceDetails = async () => {
			const res = await FormulaAxios.get(
				`/${selectedYear}/${id}/qualifying.json`
			);
			const qualifyingResults =
				res.data?.MRData?.RaceTable?.Races[0]?.QualifyingResults;
			const res1 = await FormulaAxios.get(
				`/${selectedYear}/${id}/results.json`
			);
			const res2 = await FormulaAxios.get(
				`/${selectedYear}/${id}/results.json`
			);
			setRaceResults(res1.data.MRData.RaceTable.Races[0].Results);
			setGrandPrixDetails(res2.data.MRData.RaceTable.Races);
			setQualifiers(qualifyingResults || []);

			setIsLoading(false);
		};

		getRaceDetails();

		if (qualifiers.length === 0) {
			setError((prevError) => {
				if (!prevError) {
					return {
						title: 'No Qualifying Results',
						message: `We're sorry, but there are no qualifying results available for the 2013 season.`,
					};
				}
				return prevError;
			});
		}
	}, [id, selectedYear, qualifiers.length]);

	const getBestTime = (qualifier) => {
		const times = [qualifier.Q1, qualifier.Q2, qualifier.Q3];
		const shortestTime = times.sort();
		return shortestTime[0];
	};

	const items = [
		{
			href: '/races',
			title: 'Races',
		},
		{
			href: '',
			title: grandPrixDetails[0]?.raceName,
		},
	];

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className='details-container'>
			{error && (
				<ErrorModal
					title={error.title}
					message={error.message}
					onConfirm={() => setError(null)}
				/>
			)}
			<Breadcrumbs items={items} />
			<div className='driver-team-details'>
				<div
					className='details-info'
					key={grandPrixDetails[0].Circuit.circuitId}
				>
					<div className='driver-team-info'>

						{getFlagCode(grandPrixDetails[0].Circuit.Location.country) === 'AZ' ? (
							<img
								src={azerbaijanFlag}
								alt='Azerbaijan Flag'
								className='flag-az'
							/>
						) : (
							<Flag
								className='flag-icon'
								country={getFlagCode(grandPrixDetails[0].Circuit.Location.country)}
							/>
						)}
						<p className='race-name'>{grandPrixDetails[0].raceName}</p>
					</div>
					<div className='aditional-info'>
						<div className='driver-aditional-info-left'>
							<p>
								<span className='aditional-info-label'>Country: </span>
								{grandPrixDetails[0].Circuit.Location.country}
							</p>
							<p>
								<span className='aditional-info-label'>Location: </span>
								{grandPrixDetails[0].Circuit.Location.locality}
							</p>
							<p>
								<span className='aditional-info-label'>Date:</span>
								{grandPrixDetails[0].date}
							</p>
							<p>
								<span className='aditional-info-label'>
									Full Report:
								</span>
								<Link
									target='blank'
									to={grandPrixDetails[0].Circuit.url}
								>
									<RiShareBoxLine className='share-icon' size={15} />
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`grand-prix-table-section ${qualifiers.length === 0 ? 'no-qualifying-results' : ''
					}`}
			>
				{qualifiers.length > 0 && (
					<div className='table-wrapper table-wrapper-grand-prix'>
						<table>
							<caption>Qualifying Results</caption>
							<thead>
								<tr>
									<th>Pos</th>
									<th>Driver</th>
									<th>Team</th>
									<th>Best Time</th>
								</tr>
							</thead>
							<tbody>
								{qualifiers.map((qualifier) => (
									<tr key={qualifier.position}>
										<td>{qualifier.position}</td>
										<td>
											<div className='details-race'>
												<Flag
													country={getFlagCode(
														qualifier.Driver.nationality
													)}
													className='flag-icon'
												/>
												<Link to={`/drivers/${qualifier.Driver.driverId}`}
													className='link'>
													{qualifier.Driver.familyName}</Link>
											</div>
										</td>
										<td><Link to={`/teams/${qualifier.Constructor.constructorId}`}
											className='link'>
											{qualifier.Constructor.name}</Link></td>
										<td>{getBestTime(qualifier)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				<div className='table-wrapper table-wrapper-grand-prix'>
					<table>
						<caption>Race Results</caption>
						<thead>
							<tr>
								<th>Pos</th>
								<th>Driver</th>
								<th>Team</th>
								<th>Result</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							{raceResults.map((result) => (
								<tr key={result.position}>
									<td>{result.position}</td>
									<td>
										<div className='details-race'>
											<Flag
												country={getFlagCode(
													result.Driver.nationality
												)}
												className='flag-icon'
											/>
											<Link to={`/drivers/${result.Driver.driverId}`}
												className='link'>{result.Driver.familyName}</Link>
										</div>
									</td>
									<td><Link to={`/teams/${result.Constructor.constructorId}`}
										className='link'>
										{result.Constructor.name}</Link></td>
									<td>{result.Time ? result.Time.time : null}</td>
									<td
										className={`default-background position-${result.position}`}
									>
										{result.points}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default GrandPrixDetails;
