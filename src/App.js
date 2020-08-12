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
import Previous from './components/Previous';
import Diagnostic from './components/Diagnostic';
import ChooseDiagnostic from './components/ChooseDiagnostic';

const App = () => {
	return (
		<div className="App">
			<Switch>
				<Route path="/choosepatient" component={ChoosePatient} />
				<Route path="/db" component={DataBase} />
				<Route path="/reports" component={Reports} />
				<Route path="/settings" component={Settings} />
				<Route
					path="/choosediagnostic/:patientId"
					component={ChooseDiagnostic}
				/>
				<Route path="/newpatient" component={NewPatient} />
				<Route path="/edit/:id" component={Edit} />
				<Route path="/previous/:id" component={Previous} />
				<Route
					path="/diagnostic/:patientId/:diagnosticId"
					component={Diagnostic}
				/>
				<Route path="/" component={Nav} />
			</Switch>
		</div>
	);
};

export default App;
