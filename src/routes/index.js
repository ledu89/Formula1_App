import { Route, Routes } from 'react-router-dom';
import Drivers from '../components/Drivers/Drivers';
import Teams from '../components/Teams/Teams';
import Races from '../components/Races/Races';
import DriverDetails from '../components/Drivers/DriverDetails';
import GrandPrixDetails from '../components/Races/GrandPrixDetails';
import TeamsDetails from '../components/Teams/TeamsDetails';
import Home from '../components/Layout/Home';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/drivers' element={<Drivers />} />
			<Route path='/teams' element={<Teams />} />
			<Route path='/races' element={<Races />} />
			<Route path='/drivers/:id' element={<DriverDetails />} />
			<Route path='/teams/:id' element={<TeamsDetails />} />
			<Route path='/races/:id' element={<GrandPrixDetails />} />
		</Routes>
	);
};
