import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const Diagnostic = () => {
	const [form, setForm] = useState({ name: '', blocks: [], count: 0 });
	const [data, setData] = useState({});
	const { patientId, diagnosticId } = useParams();
	const handleKey = (e) => {
		if (e.altKey && e.keyCode === 37) return history.goBack();
		if (e.keyCode === 13) return handleSubmit();
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
	let unblock;
	useEffect(() => {
		unblock = history.block('Ви впевнені що хочете покинути цю стрінку?');
	}, []);
	const history = useHistory();
	const handleFormChange = (e) =>
		setData({ ...data, [e.target.name]: e.target.value });
	const handleSubmit = () => {
		let count = 0;
		for (let key in data) if (data[key] !== '') count++;
		if (count >= form.count)
			ipcRenderer.send('createDocx', { data, id: diagnosticId, patientId });
	};

	useEffect(() => {
		ipcRenderer.send('getDiagnostic', { id: diagnosticId });
		ipcRenderer.on('getDiagnostic-reply', (event, arg) => {
			setForm(JSON.parse(arg.data.dataValues.form));
		});
		ipcRenderer.on('createDocx-reply', (event, arg) => {
			console.log('hello there?');
			unblock();
			history.push(`/viewprevious/${arg.id}`);
		});
		return () => {
			unblock();
			ipcRenderer.removeAllListeners('createDocx-reply');
			ipcRenderer.removeAllListeners('getDiagnostic-reply');
		};
	}, [diagnosticId, history, unblock]);
	return (
		<div>
			<div className="nav-menu">
				{console.log(form.blocks)}
				<div
					className="menu-item"
					onClick={() => history.push(`/choosediagnostic/${patientId}`)}>
					Назад
				</div>
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
								<div onClick={() => remote.getCurrentWindow().close()}>
									Вийти
								</div>
								<div onClick={() => close()}>Відминити</div>
							</div>
						</div>
					)}
				</Popup>
			</div>
			<div className="diagnostic">
				<h1>{form.name}</h1>
				{form.blocks.map((el, id) => (
					<div className="block" key={id}>
						<h3>{el.name}</h3>
						{el.inputs.map((el, id2) => (
							<div className="field" key={id2}>
								{el.prelabel ? <p>{el.prelabel}</p> : ''}
								<div>
									{el.type !== 'inputxinput' ? (
										el.type === 'inputxinputxinput' ? (
											<label>
												<input
													type="number"
													name={`${id}_${id2}_0`}
													onChange={handleFormChange}
												/>
												x
												<input
													type="number"
													name={`${id}_${id2}_1`}
													onChange={handleFormChange}
												/>
												x
												<input
													type="number"
													name={`${id}_${id2}_2`}
													onChange={handleFormChange}
												/>
												{el.afterlabel ? ` ${el.afterlabel}` : ''}
											</label>
										) : el.type === 'radio' ? (
											el.values.map((el, tmp) => (
												<label key={tmp}>
													<input
														type="radio"
														name={`${id}_${id2}`}
														onChange={handleFormChange}
														value={el}
													/>
													{el}
												</label>
											))
										) : (
											<label>
												<input
													type="number"
													name={`${id}_${id2}`}
													onChange={handleFormChange}
												/>
												{el.afterlabel ? ` ${el.afterlabel}` : ''}
											</label>
										)
									) : (
										<label>
											<input
												type="text"
												name={`${id}_${id2}_0`}
												onChange={handleFormChange}
											/>
											x
											<input
												type="text"
												name={`${id}_${id2}_1`}
												onChange={handleFormChange}
											/>
											{el.afterlabel ? ` ${el.afterlabel}` : ''}
										</label>
									)}
								</div>
							</div>
						))}
					</div>
				))}
				<textarea
					placeholder="Заключення"
					name="conclusion"
					onChange={handleFormChange}></textarea>
				<div className="button" onClick={handleSubmit}>
					Продовжити
				</div>
			</div>
			<div className="func-keys">
				<div>
					<strong>F1</strong> - Допомога
				</div>
				<div>
					<strong>&#62;/&#60;/Tab/Space</strong> - Повернутися назад
				</div>
				<div>
					<strong>Enter</strong> - Продовжити
				</div>
			</div>
		</div>
	);
};

export default Diagnostic;
