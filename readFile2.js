const fs = require('fs');

fs.readdir('./data', (err, files) => {
	const filePromises = files.map((filename, index) => {
		return new Promise((resolve, reject) => {
			fs.readFile(`./data/${filename}`, (err, data) => {
				// console.log(filename);
				if (err) reject(err);
				resolve({
					filename,
					data: String(data),
				});
			});
		});
	});
	// console.log(filePromises);
	Promise.all(filePromises)
		.then((fileContentArray) => {
			const arrayCount = fileContentArray.map((fileObj) => {
				const matches = fileObj.data.match(/gotYa/g);
				return matches
					? { [fileObj.filename]: matches.length }
					: { [fileObj.filename]: 0 };
			});
			// console.log(arrayCount);
			const orderedArray = arrayCount.sort((a, b) => {
				return a - b;
			});
			console.log(orderedArray);
			return orderedArray;
		})
		.catch((err) => {
			console.log(err);
		});

	Promise.race(filePromises).then((file) => {
		console.log(file);
	});
});
