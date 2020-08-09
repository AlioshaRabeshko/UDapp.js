import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const Diagnostic = () => {
	const [patients, setPatients] = useState([]);
	useEffect(() => {
		ipcRenderer.send('getPatients', { name: '' });
		ipcRenderer.on('getPatients-reply', (event, arg) => setPatients(arg.data));
		return () => ipcRenderer.removeAllListeners('getPatients-reply');
	}, []);
	return (
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
							<p>{el.dataValues.name}</p>
							<p>{el.dataValues.settle}</p>
						</div>
						<div>
							<Link to={`/edit/${el.dataValues.id}`}>Редагувати</Link>
							<p>Видалити</p>
							<p>Продовжити</p>
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
	);
};

export default Diagnostic;
