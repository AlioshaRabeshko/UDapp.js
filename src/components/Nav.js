import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
	return (
		<div className="cards">
			<Link as="a" to="/choosepatient">
				<div className="card">Обстеження</div>
			</Link>
			<Link as="a" to="/db">
				<div className="card">База даних</div>
			</Link>
			<Link as="a" to="/settings">
				<div className="card">Налаштування</div>
			</Link>
		</div>
	);
};

export default Nav;
