import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const ChooseDiagnostic = () => {
	const [diagnostics, setDiagnostics] = useState([]);
	const [selected, setSelected] = useState(-1);
	const history = useHistory();
	const { patientId } = useParams();
	const handleKey = (e) => {
		if (e.altKey && e.keyCode === 37) return history.goBack();
		if (e.altKey && e.keyCode === 39) return history.goForward();
		if (e.keyCode === 33) return setSelected(0);
		if (e.keyCode === 34) return setSelected(diagnostics.length - 1);
		if (e.keyCode === 38 && selected > 0) return setSelected(selected - 1);
		if (e.keyCode === 40 && selected < diagnostics.length - 1)
			return setSelected(selected + 1);
		if (e.keyCode === 36) return history.push('/');
		if (e.keyCode === 13)
			return history.push(
				`/diagnostic/${patientId}/${diagnostics[selected].id}`
			);
		if (e.keyCode === 112) return history.push('/help');
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
	useEffect(() => {
		ipcRenderer.send('getDiagnostics');
		ipcRenderer.on('getDiagnostics-reply', (event, arg) =>
			setDiagnostics(arg.data)
		);
		return () => ipcRenderer.removeAllListeners('getDiagnostics-reply');
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
				<ul>
					{diagnostics.map((el, id) => (
						<li key={id} className={id === selected ? 'selected' : null}>
							<div className="diagnostic-p">
								<p>{el.form.name}</p>
							</div>
							<div className="diagnostic-p">
								<Link to={`/diagnostic/${patientId}/${el.id}`}>Продовжити</Link>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className="func-keys">
				<div>
					<strong>F1</strong> - Допомога
				</div>
				<div>
					<strong>&#8743;/&#8744;/PgUp/PgDn</strong> - Вверх/вниз
				</div>
				<div>
					<strong>Enter</strong> - Продовжити
				</div>
				<div>
					<strong>Home</strong> - Повернутися на головну
				</div>
			</div>
		</div>
	);
};

export default ChooseDiagnostic;
