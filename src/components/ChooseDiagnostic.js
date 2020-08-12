import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const ChooseDiagnostic = () => {
	const [diagnostics, setDiagnostics] = useState([]);
	const history = useHistory();
	const { patientId } = useParams();
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
						<li key={id}>
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
		</div>
	);
};

export default ChooseDiagnostic;
