import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const Settings = () => {
	const history = useHistory();
	const [settings, setSettings] = useState([]);
	const [newSettings, setNewSettings] = useState({});
	useEffect(() => {
		ipcRenderer.send('fetchSettings');
		ipcRenderer.on('fetchSettings-reply', (event, arg) =>
			setSettings(arg.settings)
		);
		return () => ipcRenderer.removeAllListeners('fetchSettings-reply');
	}, []);
	return (
		<div>
			<div className="nav-menu">
				<Popup
					trigger={<div className="menu-item">Повернутися на головну</div>}
					modal>
					{(close) => (
						<div>
							<p>
								Ви впевнені що хочете перейти на головгу сторінку? Незбережені
								дані будуть втрачені
							</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div onClick={() => history.push('/')}>Перейти</div>
							</div>
						</div>
					)}
				</Popup>
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
			<div className="settings">
				<h2>Налаштування</h2>
				<table>
					{settings.map((el, id) => (
						<tr key={id}>
							<th>{el.dataValues.title}:</th>
							<th>
								{el.dataValues.property !== 'resolution' ? (
									el.dataValues.property === 'screen' ? (
										<select
											name={el.dataValues.property}
											defaultValue={el.dataValues.value}
											onChange={(e) =>
												setNewSettings({
													...newSettings,
													[el.dataValues.property]: e.target.value,
												})
											}>
											<option value="fullscreen">На весь екран</option>
											<option value="window">Вікном</option>
											<option value="borderless">Безрамковий</option>
										</select>
									) : (
										<input
											type="text"
											name={el.dataValues.property}
											defaultValue={el.dataValues.value}
											onChange={(e) =>
												setNewSettings({
													...newSettings,
													[el.dataValues.property]: e.target.value,
												})
											}
										/>
									)
								) : (
									<select
										name={el.dataValues.property}
										defaultValue={el.dataValues.value}
										onChange={(e) =>
											setNewSettings({
												...newSettings,
												[el.dataValues.property]: e.target.value,
											})
										}>
										<option value="1280x720">1280x720</option>
										<option value="1680x1050">1680x1050</option>
										<option value="1920x1080">1920x1080</option>
									</select>
								)}
							</th>
						</tr>
					))}
				</table>
				<p
					onClick={() =>
						ipcRenderer.send('saveSettings', { data: newSettings })
					}>
					Зберегти
				</p>
			</div>
		</div>
	);
};

export default Settings;
