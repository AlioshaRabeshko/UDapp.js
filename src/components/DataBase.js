import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const DataBase = () => {
	const [patients, setPatients] = useState([]);
	const history = useHistory();
	useEffect(() => {
		ipcRenderer.send('getPatients', { name: '' });
		ipcRenderer.on('getPatients-reply', (event, arg) => setPatients(arg.data));
		return () => ipcRenderer.removeAllListeners('getPatients-reply');
	}, []);
	return (
		<div className="container">
			<div className="nav-menu">
				<div className="menu-item" onClick={() => history.push('/')}>
					Повернутися на головну
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
					type="text"
					placeholder="Ім'я пацієнта"
					onChange={(e) =>
						ipcRenderer.send('getPatients', { name: e.target.value })
					}
				/>
				<ul>
					{patients.map((el, id) => (
						<li key={id}>
							<div>
								<Link to={`/previous/${el.dataValues.id}`}>
									<p>{el.dataValues.name}</p>
								</Link>
								<p>{el.dataValues.settle}</p>
							</div>
							<div>
								<Link to={`/edit/${el.dataValues.id}`}>Редагувати</Link>
								<p>Видалити</p>
							</div>
						</li>
					))}
					<Link to="/newpatient">
						<li>
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

export default DataBase;
