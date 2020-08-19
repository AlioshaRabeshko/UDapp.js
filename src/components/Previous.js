import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
const { ipcRenderer, remote } = window.require('electron');

const Previous = () => {
	const [popup, setPopup] = useState(false);
	const [deleteId, setDeleteId] = useState([0, 0]);
	const [selected, setSelected] = useState(-1);
	const [previous, setPrevious] = useState([]);
	const { id } = useParams();
	const history = useHistory();
	const handleKey = (e) => {
		if (e.altKey && e.keyCode === 37) return history.goBack();
		if (e.altKey && e.keyCode === 39) return history.goForward();
		if (e.keyCode === 33) return setSelected(0);
		if (e.keyCode === 34) return setSelected(previous.length - 1);
		if (e.keyCode === 38 && selected > 0) return setSelected(selected - 1);
		if (e.keyCode === 40 && selected < previous.length - 1)
			return setSelected(selected + 1);
		if (e.keyCode === 13)
			return history.push(`/viewprevious/${previous[selected].id}`);
		if (e.keyCode === 112) return history.push('/help');
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleKey]);
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
						<li key={id} className={id === selected ? 'selected' : null}>
							<div>
								<p>{el.name}</p>
							</div>
							<div>
								<p>{el.createdAt.toLocaleDateString()}</p>
								<p
									className="menu-item"
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

			<div className="func-keys">
				<div>
					<strong>F1</strong> - Допомога
				</div>
				<div>
					<strong>Delete</strong> - Видалити
				</div>
				<div>
					<strong>&#8743;/&#8744;/PgUp/PgDn</strong> - Вверх/вниз
				</div>
				<div>
					<strong>Enter</strong> - Переглянути
				</div>
				<div>
					<strong>Alt &#60;</strong> - Повернутися назад
				</div>
				<div>
					<strong>Alt &#62;</strong> - Повернутися вперед
				</div>
			</div>
		</div>
	);
};

export default Previous;
