'use strict';

const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { Sequelize } = require('sequelize');
const Patients = require('../models/patient');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	// mainWindow.setMenu(null);
	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	);
	mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('getPatients', async (e, arg) => {
	const patients = await Patients.findAll();
	const filtered = patients.filter(
		(el) => el.name.toLowerCase().indexOf(arg.name) !== -1
	);
	if (filtered.length > 0) e.reply('getPatients-reply', { data: filtered });
	else e.reply('getPatients-reply', { data: [] });
});

ipcMain.on('getSettle', async (e, arg) => {
	const settlesDate = await Patients.findAll({
		attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('settle')), 'settle']],
	});
	const settles = settlesDate.map((el) => el.settle);
	if (settles.length > 0) e.reply('getSettle-reply', { settles });
});

ipcMain.on('addPatient', async (e, arg) => {
	const { name, birthday, settle } = arg;
	const patient = await Patients.create({ name, birthday, settle });
	if (patient) e.reply('addPatient-reply', { status: true });
	// const settles = settlesDate.map((el) => el.settle);
	// if (settles.length > 0) e.reply('addPatient-reply', { settles });
});