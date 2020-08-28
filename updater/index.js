'use strict';

const fs = require('fs');
const http = require('http');
const admzip = require('adm-zip');
const rimraf = require('rimraf');
const os = require('os');

const FILES = ['diagnostics.db', 'patients.db', 'settings.db', 'installed.txt'];
const osData =
	os.platform() === 'win32'
		? {
				download:
					'http://s3.eu-central-1.amazonaws.com/udapp.bucket/win-unpacked.zip',
				folder: 'win-unpacked',
				exe: 'udapp.exe',
		  }
		: {
				download:
					'http://s3.eu-central-1.amazonaws.com/udapp.bucket/linux-unpacked.zip',
				folder: 'linux-unpacked',
				exe: 'udapp',
		  };

if (fs.existsSync('./udapp')) {
	FILES.forEach((el) => {
		if (fs.existsSync(`./udapp/${el}`))
			fs.copyFileSync(`./udapp/${el}`, `./${el}`);
	});
	rimraf.sync('./udapp');
}
const file = fs.createWriteStream('udapp.zip');
const request = http.get(osData.download, (response) => response.pipe(file));
file.on('close', () => {
	const zip = new admzip('udapp.zip', true);
	zip.extractAllTo('./');
	fs.unlinkSync('./udapp.zip');
	fs.renameSync(osData.folder, `./udapp`);
	if (os.platform() !== 'win32') fs.chmodSync('./udapp/udapp', '777');
	FILES.forEach((el) => fs.copyFileSync(`./${el}`, `./udapp/${el}`));
});
