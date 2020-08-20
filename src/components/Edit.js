import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const NewPatient = () => {
	const [date, setDate] = useState(false);
	const [name, setName] = useState(false);
	const [settle, setSettle] = useState(false);
	const [settles, setSettles] = useState([]);
	const [sex, setSex] = useState();
	const { id } = useParams();
	const history = useHistory();
	const handleKey = (e) => {
		if (e.altKey && e.keyCode === 37) return history.goBack();
		if (e.keyCode === 36) return history.push('/');
		if (e.keyCode === 13) return newPatient();
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
	useEffect(() => {
		ipcRenderer.send('getSettle');
		ipcRenderer.on('getSettle-reply', (event, arg) => {
			setSettles(arg.settles);
		});
		ipcRenderer.send('getPatient', { id });
		ipcRenderer.on('getPatient-reply', (event, arg) => {
			const [mm, dd, yy] = arg.data.dataValues.birthday
				.toLocaleDateString('en-US')
				.split('/');
			setDate(`${yy}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`);
			setName(arg.data.dataValues.name);
			setSettle(arg.data.dataValues.settle);
			setSex(arg.data.dataValues.sex);
		});
		ipcRenderer.on('editPatient-reply', (event, arg) => {
			if (arg.status) history.push('/');
		});
		return () => {
			ipcRenderer.removeAllListeners('editPatient-reply');
			ipcRenderer.removeAllListeners('getSettle-reply');
			ipcRenderer.removeAllListeners('getPatient-reply');
		};
	}, [history, id]);
	const newPatient = () => {
		if (!name) return;
		if (!date) return;
		if (!settle) return;
		ipcRenderer.send('editPatient', {
			name,
			birthday: new Date(date),
			settle,
			sex,
			id,
		});
	};
	return (
		<div className="new-patient">
			<p>Редагувати дані про пацієнта</p>
			<input
				type="text"
				placeholder="Призвіще Ім'я По-батькові"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<div className="date">
				<input
					type="date"
					id="start"
					name="trip-start"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					min="1930-01-01"
					max="2025-12-31"
				/>
				<input
					type="text"
					list="settlement"
					className="settlement"
					value={settle}
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
							onChange={() => setSex(true)}
							name="sex"
						/>
						Чоловік
					</label>
					<label>
						<input
							type="radio"
							defaultChecked={!sex}
							onChange={() => setSex(false)}
							name="sex"
						/>
						Жінка
					</label>
				</div>
			</div>
			<button onClick={newPatient}>Зберегти</button>
			<div className="func-keys">
				<div>
					<strong>F1</strong> - Допомога
				</div>
				<div>
					<strong>Alt &#60;</strong> - Повернутися назад
				</div>
				<div>
					<strong>Enter</strong> - Зберегти
				</div>
				<div>
					<strong>Home</strong> - Повернутися на головну
				</div>
			</div>
		</div>
	);
};

export default NewPatient;
