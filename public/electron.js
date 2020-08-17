'use strict';

const {
	globalShortcut,
	app,
	BrowserWindow,
	shell,
	remote,
	ipcRenderer,
} = require('electron');
if (require('electron-squirrel-startup')) return;
const { ipcMain } = require('electron');
const { Sequelize } = require('sequelize');
const pizzip = require('pizzip');
const docx = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');

const Patients = require('./models/patients');
const Diagnostics = require('./models/diagnostics');
const Forms = require('./models/forms');
const Settings = require('./models/settings');
const { settings } = require('cluster');

let mainWindow;

function createWindow() {
	Settings.findAll({
		where: { property: ['resolution', 'screen'] },
	}).then((data) => {
		mainWindow = new BrowserWindow({
			width: +data[0].dataValues.value.split('x')[0],
			height: +data[0].dataValues.value.split('x')[1],
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
			},
			frame: data[1].dataValues.value !== 'borderless',
			fullscreen: data[1].dataValues.value === 'fullscreen',
		});
		mainWindow.setMenu(null);
		mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
		mainWindow.on('closed', () => (mainWindow = null));
	});
}

app.on('ready', async () => {
	if (!fs.existsSync('installed.txt')) {
		const forms = [
			{
				name: 'Обстеження органів сечовидільної системи',
				form:
					'{"name":"Обстеження органів сечовидільної системи","count":28,"blocks":[{"name":"Ліва нирка","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Типово","Нетипово","Нефроптоз І","Нефроптоз ІІ"]},{"type":"inputxinput","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Паренхіма:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Шари диференціюються:","values":["Чітко","Нечітко"]},{"type":"radio","prelabel":"Співвідношення паренхіми до ЧМС:","values":["3:1","2:1","1:1"]},{"type":"input","prelabel":"ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:","afterlabel":"мм"},{"type":"radio","prelabel":"Конкременти:","values":["Виявлено","Невиявлено"]}]},{"name":"Права нирка","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Типово","Нетипово","Нефроптоз І","Нефроптоз ІІ"]},{"type":"inputxinput","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Паренхіма:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Шари диференціюються:","values":["Чітко","Нечітко"]},{"type":"radio","prelabel":"Співвідношення паренхіми до ЧМС:","values":["3:1","2:1","1:1"]},{"type":"input","prelabel":"ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:","afterlabel":"мм"},{"type":"radio","prelabel":"Конкременти:","values":["Виявлено","Невиявлено"]}]},{"name":"Сечовий міхур","inputs":[{"type":"radio","values":["Виповнений","Невиповнений"]},{"type":"input","prelabel":"V","afterlabel":"мм"},{"type":"input","prelabel":"Vзал","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Вміст","values":["Однорідний","Неоднорідний"]},{"type":"input","prelabel":"Стінки","afterlabel":"мм"},{"type":"radio","prelabel":"Сечоводи","values":["Нерозширені","Розширені  "]}]}]}',
				docxName: 'tmp3.docx',
			},
			{
				name: 'Обстеження органів черевної порожнини',
				form:
					'{"name":"Обстеження органів черевної порожнини","count":29,"blocks":[{"name":"Печінка","inputs":[{"type":"input","prelabel":"Ліва доля:","afterlabel":"мм"},{"type":"input","prelabel":"Права доля:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Краї:","values":["Типово","Нетипово"]},{"type":"radio","prelabel":"Ехоструктура:","values":["Дрібнозерниста","Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Ворітка вежа:","afterlabel":"мм"},{"type":"input","prelabel":"НПВ:","afterlabel":"мм"},{"type":"input","prelabel":"Холедох:","afterlabel":"мм"}]},{"name":"Жовчний міхур","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Визначається","Не визначається"]},{"type":"input","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Стінки:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]}]},{"name":"Підшлункова залоза","inputs":[{"type":"radio","prelabel":"Візуалізація:","values":["Візуалізується","Не візуалізується"]},{"type":"radio","prelabel":"Візуалізація:","values":["Повністю","Неповністю"]},{"type":"inputxinputxinput","prelabel":"Розміри","afterlabel":"мм"},{"type":"radio","prelabel":"Структура:","values":["Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Панкреатична протока","afterlabel":"мм"}]},{"name":"Селезінка","inputs":[{"type":"input","prelabel":"Розміри","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Ехоструктура:","values":["Дрібнозерниста","Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Селезінкова вежа у воротах селезінки","afterlabel":"мм"}]}]}',
				docxName: 'tmp2.docx',
			},
		];
		for (const el of forms)
			await Forms.findOrCreate({
				where: { name: el.name },
				defaults: { ...el },
			});
		const settings = [
			{
				property: 'doctor',
				value: '',
				title: "Ім'я лікаря",
			},
			{
				property: 'device',
				value: '',
				title: 'Назва пристрою',
			},
			{
				property: 'resolution',
				value: '1280x720',
				title: 'Розширення екрану',
			},
			{
				property: 'screen',
				value: 'window',
				title: 'Екран',
			},
		];

		for (const el of settings)
			await Settings.findOrCreate({
				where: { property: el.property },
				defaults: { ...el },
			});
		fs.appendFile('installed.txt', 'Installed!', (err) => app.quit());
	} else createWindow();
});

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
		(el) => el.name.toLowerCase().indexOf(arg.name.toLowerCase()) !== -1
	);
	if (filtered.length > 0) e.reply('getPatients-reply', { data: filtered });
	else e.reply('getPatients-reply', { data: [] });
});

ipcMain.on('getPatient', async (e, arg) => {
	const patient = await Patients.findOne({ where: { id: arg.id } });
	e.reply('getPatient-reply', { data: patient });
});

ipcMain.on('getSettle', async (e, arg) => {
	const settlesDate = await Patients.findAll({
		attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('settle')), 'settle']],
	});
	const settles = settlesDate.map((el) => el.settle);
	if (settles.length > 0) e.reply('getSettle-reply', { settles });
});

ipcMain.on('addPatient', async (e, arg) => {
	const patient = await Patients.create(arg);
	if (patient) e.reply('addPatient-reply', { status: true });
});

ipcMain.on('editPatient', async (e, arg) => {
	const patient = await Patients.findOne({ where: { id: arg.id } });
	patient.name = arg.name;
	patient.birthday = arg.birthday;
	patient.settle = arg.settle;
	patient.sex = arg.sex;
	patient.save();
	e.reply('editPatient-reply', { status: true });
});

ipcMain.on('createDocx', async (e, arg) => {
	const { data, id, patientId } = arg;
	const patient = (await Patients.findOne({ where: { id: patientId } }))
		.dataValues;
	const doctor = (await Settings.findOne({ where: { property: 'doctor' } }))
		.dataValues;
	const device = (await Settings.findOne({ where: { property: 'device' } }))
		.dataValues;
	const { docxName } = (await Forms.findOne({ where: { id } })).dataValues;
	const template = fs.readFileSync(path.resolve(__dirname, docxName), 'binary');
	const zip = new pizzip(template);
	try {
		const doc = new docx(zip);
		const obj = {
			...data,
			name: patient.name,
			birthday: patient.birthday.toLocaleDateString(),
			date: new Date().toLocaleDateString(),
			doctor: doctor.value,
			device: device.value,
		};
		const tmp = await Diagnostics.create({
			patientId,
			diagnosticId: id,
			data: JSON.stringify(obj),
		});
		doc.setData(obj);
		doc.render();
		const buf = doc.getZip().generate({ type: 'nodebuffer' });
		const output = path.resolve('./output.docx');
		const writeStream = fs.createWriteStream(output);
		writeStream.write(buf);
		shell.openPath(output);
		e.reply('createDocx', { id: tmp.dataValues.id });
	} catch (error) {
		console.log(error);
	}
});

ipcMain.on('getDiagnostics', async (e, arg) => {
	const strings = await Forms.findAll();
	const forms = strings.map((el) => ({
		form: JSON.parse(el.dataValues.form),
		id: el.dataValues.id,
	}));
	e.reply('getDiagnostics-reply', { data: forms });
});

ipcMain.on('getDiagnostic', async (e, arg) => {
	const data = await Forms.findOne({ where: { id: arg.id } });
	e.reply('getDiagnostic-reply', { data });
});

ipcMain.on('getPrevious', async (e, arg) => {
	const res = await Diagnostics.findAll({ where: { patientId: arg.id } });
	const newRes = [];
	for (const val of res) {
		const form = await Forms.findOne({
			where: { id: val.dataValues.diagnosticId },
		});
		newRes.push({
			name: form.dataValues.name,
			id: val.dataValues.id,
			createdAt: val.dataValues.createdAt,
		});
	}
	e.reply('getPrevious-reply', { data: newRes });
});

ipcMain.on('deleteReport', async (e, arg) => {
	const item = await Diagnostics.findOne({ where: { id: arg.id } });
	item.destroy();
});

ipcMain.on('getReport', async (e, arg) => {
	const data = await Diagnostics.findOne({ where: { id: arg.id } });
	const form = await Forms.findOne({
		where: { id: data.dataValues.diagnosticId },
	});
	const patient = await Patients.findOne({
		where: { id: data.dataValues.patientId },
	});
	e.reply('getReport-reply', {
		data: data.dataValues.data,
		form: form.dataValues,
		patient: patient.dataValues,
	});
});

ipcMain.on('genDocx', async (e, arg) => {
	const objData = await Diagnostics.findOne({ where: { id: arg.id } });
	const form = await Forms.findOne({
		where: { id: objData.dataValues.diagnosticId },
	});
	const { data, docxName } = form.dataValues;
	const obj = JSON.parse(objData.dataValues.data);
	const template = fs.readFileSync(path.resolve(__dirname, docxName), 'binary');
	const zip = new pizzip(template);
	try {
		const doc = new docx(zip);
		doc.setData(obj);
		doc.render();
		const buf = doc.getZip().generate({ type: 'nodebuffer' });
		const output = path.resolve('./output.docx');
		const writeStream = fs.createWriteStream(output);
		writeStream.write(buf);
		shell.openPath(output);
	} catch (error) {
		console.log(error);
	}
});

ipcMain.on('fetchSettings', async (e, arg) => {
	const settings = await Settings.findAll();
	e.reply('fetchSettings-reply', { settings });
});

ipcMain.on('saveSettings', async (e, arg) => {
	const { data } = arg;
	for (let key in data) {
		const setting = await Settings.findOne({ where: { property: key } });
		setting.value = data[key];
		setting.save();
	}
});
// const form = JSON.stringify({
// 	name: 'Обстеження органів черевної порожнини',
// 	count: 29,
// 	blocks: [
// 		{
// 			name: 'Печінка',
// 			inputs: [
// 				{
// 					type: 'input',
// 					prelabel: 'Ліва доля:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Права доля:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Краї:',
// 					values: ['Типово', 'Нетипово'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехоструктура:',
// 					values: ['Дрібнозерниста', 'Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Ворітка вежа:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'НПВ:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Холедох:',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 		{
// 			name: 'Жовчний міхур',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Розміщена:',
// 					values: ['Визначається', 'Не визначається'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Розміри:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Стінки:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 			],
// 		},
// 		{
// 			name: 'Підшлункова залоза',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Візуалізація:',
// 					values: ['Візуалізується', 'Не візуалізується'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Візуалізація:',
// 					values: ['Повністю', 'Неповністю'],
// 				},
// 				{
// 					type: 'inputxinputxinput',
// 					prelabel: 'Розміри',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Структура:',
// 					values: ['Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Панкреатична протока',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 		{
// 			name: 'Селезінка',
// 			inputs: [
// 				{
// 					type: 'input',
// 					prelabel: 'Розміри',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехоструктура:',
// 					values: ['Дрібнозерниста', 'Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Селезінкова вежа у воротах селезінки',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 	],
// });
// Forms.create({
// 	name: 'Обстеження органів сечовидільної системи',
// 	form,
// 	docxName: 'tmp2.docx',
// });
