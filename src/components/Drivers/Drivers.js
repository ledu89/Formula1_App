import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-flagkit';
import Loader from '../Loader';
import { FlagContext } from '../../contexts/FlagContext';
import FormulaAxios from '../../apis/FormulaAxios';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchDrivers } from '../Helper';
import { YearContext } from '../../contexts/YearContext';
import Breadcrumbs from '../Breadcrumbs';

const Drivers = () => {
	const { getFlagCode } = useContext(FlagContext);
	const { selectedYear } = useContext(YearContext);
	const [drivers, setDrivers] = useState([]);
	const [search, setSerach] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getDrivers = async () => {
			try {
				const res = await FormulaAxios.get(
					`${selectedYear}/driverStandings.json`
				);
				setDrivers(
					res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings
				);

				setIsLoading(false);
			} catch (error) {
				console.log('Error fetching drivers:', error);
				setIsLoading(false);
			}
		};
		getDrivers();
	}, [selectedYear]);

	const searchData = searchDrivers(drivers, search);

	const handleSearch = (e) => {
		setSerach(e.target.value);
	};

	const items = [
		{
			href: '',
			title: 'Drivers',
		},
	];

	if (isLoading) {
		return <Loader />;
	}
	return (
		<div className='container'>
			<Breadcrumbs items={items} />
			<h1 className='main-title'>Drivers Championship</h1>
			<Input
				className='search-input'
				placeholder='Search...'
				prefix={<SearchOutlined />}
				onChange={handleSearch}
			/>
			<div className='table-wrapper'>
				<table>
					<thead className='table-header'>
						<tr>
							<th colSpan={4}>
								<span className='table-header'>
									Drivers Championship Standings - {selectedYear}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{searchData.map((driver) => (
							<tr key={driver.position}>
								<td>{driver.position}</td>
								<td>
									<Link
										className='link'
										to={`/drivers/${driver.Driver.driverId}`}
									>
										<Flag
											country={getFlagCode(
												driver.Driver.nationality
											)}
											className='flag-icon'
										/>
										{`${driver.Driver.givenName} ${driver.Driver.familyName}`}
									</Link>
								</td>
								<td>
									<Link
										className='link'
										to={`/teams/${driver.Constructors[0].constructorId}`}>
										{driver.Constructors[0].name}
									</Link>
								</td>
								<td>{driver.points}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default Drivers;
