import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const NewPatient = () => {
	const [date, setDate] = useState(false);
	const [name, setName] = useState(false);
	const [settle, setSettle] = useState(false);
	const [settles, setSettles] = useState([]);
	const [sex, setSex] = useState(true);
	const history = useHistory();
	useEffect(() => {
		ipcRenderer.send('getSettle');
		ipcRenderer.on('getSettle-reply', (event, arg) => {
			setSettles(arg.settles);
		});
		ipcRenderer.on('addPatient-reply', (event, arg) => {
			if (arg.status) history.push('/diagnostic');
		});
		return () => {
			ipcRenderer.removeAllListeners('getSettle-reply');
			ipcRenderer.removeAllListeners('addPatient-reply');
		};
	}, [history]);
	const newPatient = () => {
		if (!name) return;
		if (!date) return;
		if (!settle) return;
		ipcRenderer.send('addPatient', {
			name,
			birthday: new Date(date),
			settle,
			sex,
		});
	};
	return (
		<div className="new-patient">
			<p>Добавити нового пацієнта в базу даних</p>
			<input
				type="text"
				placeholder="Призвіще Ім'я По-батькові"
				onChange={(e) => setName(e.target.value)}
			/>
			<div className="date">
				<input
					type="date"
					id="start"
					name="trip-start"
					onChange={(e) => setDate(e.target.value)}
					min="1930-01-01"
					max="2025-12-31"
				/>
				<input
					type="text"
					list="settlement"
					placeholder="Місце проживання"
					onChange={(e) => setSettle(e.target.value)}
				/>
				<datalist id="settlement">
					{settles.map((el, id) => (
						<option key={id}>{el}</option>
					))}
				</datalist>
				<div className="radio">
					<label>
						<input
							type="radio"
							defaultChecked={sex}
							onClick={() => setSex(true)}
							name="sex"
						/>
						Чоловік
					</label>
					<label>
						<input type="radio" onClick={() => setSex(false)} name="sex" />
						Жінка
					</label>
				</div>
			</div>
			<button onClick={newPatient}>Добавити</button>
		</div>
	);
};

export default NewPatient;
