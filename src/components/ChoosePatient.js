import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const ChoosePatient = () => {
	const [patients, setPatients] = useState([]);
	const [selected, setSelected] = useState(-1);
	const history = useHistory();
	const handleKey = (e) => {
		// console.log(e.keyCode);
		if (e.keyCode === 38 && selected > 0) return setSelected(selected - 1);
		if (e.keyCode === 34) return setSelected(patients.length);
		if (e.keyCode === 33) return setSelected(-1);
		if (e.keyCode === 40 && selected < patients.length)
			return setSelected(selected + 1);
		if (e.keyCode === 13 && selected < patients.length)
			return history.push(
				`/choosediagnostic/${patients[selected].dataValues.id}`
			);
		if (e.keyCode === 13 && selected === patients.length)
			return history.push('/newpatient');

		if (e.altKey && e.keyCode === 39) return history.goForward();
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
	useEffect(() => {
		ipcRenderer.send('getPatients', { name: '' });
		ipcRenderer.on('getPatients-reply', (event, arg) => setPatients(arg.data));
		return () => {
			ipcRenderer.removeAllListeners('getPatients-reply');
		};
	}, []);
	return (
		<div className="container">
			<div className="nav-menu">
				<div className="menu-item" onClick={() => history.push('/')}>
					Повернутися на головну
				</div>
				<div className="menu-item" onClick={() => history.push('/settings')}>
					Налаштування
				</div>
				<Popup
					trigger={<div className="menu-item">Вийти з програми</div>}
					modal>
					{(close) => (
						<div>
							<p>Ви впевнені що хочете закрити програму?</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div onClick={() => remote.getCurrentWindow().close()}>
									Вийти
								</div>
							</div>
						</div>
					)}
				</Popup>
			</div>
			<div className="patients-list">
				<input
					autoFocus
					type="text"
					placeholder="Ім'я пацієнта"
					onChange={(e) =>
						ipcRenderer.send('getPatients', { name: e.target.value })
					}
				/>
				<ul>
					{patients.map((el, id) => (
						<li key={id} className={id === selected ? 'selected' : null}>
							<div>
								<p>
									<Link to={`/previous/${el.dataValues.id}`}>
										{el.dataValues.name}
									</Link>
								</p>
								<p>{el.dataValues.settle}</p>
							</div>
							<div>
								<Link to={`/edit/${el.dataValues.id}`}>Редагувати</Link>
								<p>Видалити</p>
								<Link to={`/choosediagnostic/${el.dataValues.id}`}>
									Продовжити
								</Link>
							</div>
						</li>
					))}
					<Link to="/newpatient">
						<li
							key={patients.length}
							className={patients.length === selected ? 'selected' : null}>
							<div>
								<p>Створити</p>
							</div>
						</li>
					</Link>
				</ul>
			</div>
		</div>
	);
};

export default ChoosePatient;
