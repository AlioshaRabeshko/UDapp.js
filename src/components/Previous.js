import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const Previous = () => {
	const history = useHistory();
	const [popup, setPopup] = useState(false);
	const [deleteId, setDeleteId] = useState([0, 0]);
	const { id } = useParams();
	const [previous, setPrevious] = useState([]);
	useEffect(() => {
		ipcRenderer.send('getPrevious', { id });
		ipcRenderer.on('getPrevious-reply', (event, arg) => {
			console.log(arg.data);
			setPrevious(arg.data);
		});
		return () => ipcRenderer.removeAllListeners('getPrevious-reply');
	}, [id]);
	return (
		<div className="container">
			<div className="nav-menu">
				<div className="menu-item" onClick={() => history.push('/')}>
					Повернутися на головну
				</div>
				<Popup modal onClose={() => setPopup((popup) => !popup)} open={popup}>
					{(close) => (
						<div>
							<p>Ви впевнені що хочете видалити запис?</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div
									onClick={() => {
										ipcRenderer.send('deleteReport', { id: deleteId[0] });
										setPrevious((previous) => {
											const tmp = previous.splice(0);
											tmp.splice(deleteId[1], 1);
											return tmp;
										});
										close();
									}}>
									Видалити
								</div>
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
			<div className="patients-list">
				<ul>
					{console.log(previous)}
					{previous.map((el, id) => (
						<li key={id}>
							<div>
								<p>{el.name}</p>
							</div>
							<div>
								<p>{el.createdAt.toLocaleDateString()}</p>
								<p
									onClick={() => {
										setPopup((popup) => !popup);
										setDeleteId([el.id, id]);
									}}>
									Видалити
								</p>
								<Link to={`/viewprevious/${el.id}`}>Переглянути</Link>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Previous;
