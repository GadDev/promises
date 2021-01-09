// 1. Get file names (from the files in data.zip) using fs module's readdir.
// 2. Loop through and print off the name of each file in the dir
// 3. Using readFile (NOT readFileSync), read the files and in the callback, print the filename. Note: They will not be the same as in the previous step.
// 4. Look at the file contents, count up the total number of the string "gotYa" in each. Print an array that has the count for each file in ascending order. For a little more work, make it an object with a key of file name, value of count instead.
// 5. As soon as the full contents of any single are read, print them out. Do not wait for any other file to complete.

const fs = require('fs');

function getFiles(folder) {
	return new Promise((resolve, reject) => {
		return fs.readdir(folder, (err, files) =>
			err ? reject(err) : resolve({ filenames: files, folder })
		);
	});
}

function readContentFile(file) {
	return new Promise((resolve, reject) => {
		return fs.readFile(file, 'utf8', (err, data) => {
			if (err) throw reject(err);
			else resolve({ title: file, content: data });
		});
	});
}

const files = getFiles('./data')
	.then((res) => {
		const chainedPromises = res.filenames.map((file) => {
			return readContentFile(`${res.folder}/${file}`)
				.then((res) => {
					const regex = /gotYa/g;
					const found = res.content.match(regex);
					const occurence = found ? found.length : 0;

					return { title: res.title, occurence };
				})
				.catch((err) => err);
		});
		return Promise.all(chainedPromises).then((res) => res);
	})
	.catch((err) => err);

console.log(files.then((res) => console.log('files => ', res)));
