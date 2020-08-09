import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.scss';
import ChoosePatient from './components/ChoosePatient';
import Nav from './components/Nav';
import Settings from './components/Settings';
import DataBase from './components/DataBase';
import Reports from './components/Reports';
import NewPatient from './components/NewPatient';
import Edit from './components/Edit';
import Diagnostic from './components/Diagnostic';

const App = () => {
	return (
		<div className="App">
			<Switch>
				<Route path="/choosepatient" component={ChoosePatient} />
				<Route path="/db" component={DataBase} />
				<Route path="/reports" component={Reports} />
				<Route path="/settings" component={Settings} />
				<Route path="/newpatient" component={NewPatient} />
				<Route path="/edit/:id" component={Edit} />
				<Route path="/diagnostic" component={Diagnostic} />
				<Route path="/" component={Nav} />
			</Switch>
		</div>
	);
};

export default App;
