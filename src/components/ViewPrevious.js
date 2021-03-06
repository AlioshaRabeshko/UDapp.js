import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const Diagnostic = () => {
	const [form, setForm] = useState({ name: '', blocks: [], count: 0 });
	const [data, setData] = useState({});
	const [patient, setPatient] = useState({});
	const { id } = useParams();
	const history = useHistory();
	const handleKey = (e) => {
		if (e.altKey && e.keyCode === 37) return history.goBack();
		if (e.keyCode === 13) return ipcRenderer.send('genDocx', { id });
		if (e.keyCode === 36) return history.push('/');
		if (e.keyCode === 112) return history.push('/help');
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
	useEffect(() => {
		ipcRenderer.send('getReport', { id });
		ipcRenderer.on('getReport-reply', (event, arg) => {
			console.log(arg);
			setForm(JSON.parse(arg.form.form));
			setData(JSON.parse(arg.data));
			setPatient(arg.patient);
		});
		return () => ipcRenderer.removeAllListeners('getReport-reply');
	}, [id]);
	return (
		<div>
			<div className="nav-menu">
				<div onClick={() => history.push('/')}>Повернутися на головну</div>
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
			<div className="diagnostic">
				<h1>{form.name}</h1>
				<h3>{patient.name}</h3>
				{form.blocks.map((el, id) => (
					<div className="block" key={id}>
						<h3>{el.name}</h3>
						{el.inputs.map((el, id2) =>
							data[`${id}_${id2}`] || data[`${id}_${id2}_1`] ? (
								<div className="field" key={id2}>
									{el.prelabel ? <p>{el.prelabel}</p> : ''}
									<div>
										{el.type !== 'inputxinput' ? (
											el.type === 'inputxinputxinput' ? (
												<p>
													{data[`${id}_${id2}_0`]}x{data[`${id}_${id2}_1`]}x
													{data[`${id}_${id2}_2`]}
													{el.afterlabel ? ` ${el.afterlabel}` : ''}
												</p>
											) : el.type === 'radio' ? (
												<p>
													<input
														type="radio"
														name={`${id}_${id2}`}
														checked
														value={el}
													/>
													{data[`${id}_${id2}`]}
												</p>
											) : (
												<p>
													{data[`${id}_${id2}`]}
													{el.afterlabel ? ` ${el.afterlabel}` : ''}
												</p>
											)
										) : (
											<p>
												{data[`${id}_${id2}_0`]}x{data[`${id}_${id2}_1`]}
												{el.afterlabel ? ` ${el.afterlabel}` : ''}
											</p>
										)}
									</div>
								</div>
							) : (
								''
							)
						)}
					</div>
				))}
				<p>{data['conclusion']}</p>
				<div
					className="button"
					onClick={() => ipcRenderer.send('genDocx', { id })}>
					Згенерувати документ
				</div>
			</div>
			<div className="func-keys">
				<div>
					<strong>F1</strong> - Допомога
				</div>
				<div>
					<strong>Alt &#60;</strong> - Повернутися назад
				</div>
				<div>
					<strong>Enter</strong> - Згенерувати документ
				</div>
				<div>
					<strong>Home</strong> - Повернутися на головну
				</div>
			</div>
		</div>
	);
};

export default Diagnostic;
