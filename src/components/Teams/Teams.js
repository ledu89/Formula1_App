import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import Flag from 'react-flagkit';
import { FlagContext } from '../../contexts/FlagContext';
import { YearContext } from '../../contexts/YearContext';
import ErrorModal from '../UI/ErrorModal';
import FormulaAxios from '../../apis/FormulaAxios';
import { searchTeams } from '../Helper';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Breadcrumbs from '../Breadcrumbs';

const Teams = () => {
	const { getFlagCode } = useContext(FlagContext);
	const { selectedYear } = useContext(YearContext);
	const [teams, setTeams] = useState([]);
	const [search, setSerach] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const [showErrorMessage, setShowErrorMessage] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const getTeams = async () => {
			try {
				const res = await FormulaAxios(
					`/${selectedYear}/constructorStandings.json`
				);
				const standingsLists =
					res.data?.MRData?.StandingsTable?.StandingsLists || [];
				const teamsData =
					standingsLists.length > 0
						? standingsLists[0]?.ConstructorStandings || []
						: [];

				setTeams(teamsData);
				setIsLoading(false);
			} catch (error) {
				console.log('Error fetching teams:', error);
				setIsLoading(false);
			}
		};

		if (selectedYear >= 1950 && selectedYear < 1958) {
			setShowErrorMessage(true);
		}
		getTeams();
	}, [selectedYear]);

	const searchData = searchTeams(teams, search);

	const handleSearch = (e) => {
		setSerach(e.target.value);
	};

	const errorhandler = () => {
		setShowErrorMessage(false);
		navigate('/');
	};

	const items = [
		{
			href: '',
			title: 'Teams',
		},
	];

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className='container'>
			{showErrorMessage && (
				<ErrorModal
					title='No Team Data Available'
					message={`We're sorry, but there is no Team data. Team data is available starting from 1958.`}
					onConfirm={errorhandler}
				/>
			)}
			<Breadcrumbs items={items} />
			<h1 className='main-title'>Constructors Championship</h1>
			<Input
				className='search-input'
				placeholder='Search...'
				prefix={<SearchOutlined />}
				onChange={handleSearch}
			/>
			<div className='table-wrapper'>
				<table>
					<thead>
						<tr>
							<th colSpan={4}>
								<span className='table-header'>
									Constructors Championship Standings - {selectedYear}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{searchData.map((team) => {
							return (
								<tr key={team.Constructor.name}>
									<td>{team.position}</td>
									<td>
										<Link
											className='link'
											to={`/teams/${team.Constructor.constructorId}`}
										>
											<Flag
												country={getFlagCode(
													team.Constructor.nationality
												)}
												className='flag-icon'
											/>
											{team.Constructor.name}
										</Link>
									</td>
									<td>
										<Link
											className='link'
											target='blank'
											to={team.Constructor.url}
										>
											Details
										</Link>
									</td>
									<td>{team.points}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default Teams;
