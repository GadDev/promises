const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.API_KEY;
const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const imgUrl = `http://image.tmdb.org/t/p/w300/`;
//wrong way
// let globalMovieData = [];
// $.ajax({
// 	url: apiUrl + 'Interstellar',
// 	method: `get`,
// 	success: (movieData) => {
// 		console.log(movieData);
// 	},
// });

function getMovieData(movieTitle) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: apiUrl + movieTitle,
			method: 'get',
			success: (movieData) => {
				resolve(movieData.results);
			},
			error: (errorMsg) => {
				reject(errorMsg.responseJSON.status_message);
			},
		});
	});
}

document.getElementById('movie-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const movieTitleArray = Array.from(
		document.getElementsByClassName('movie-title')
	);
	console.log(document.getElementsByClassName('movie-title'));
	console.log(movieTitleArray);
	const moviePromises = movieTitleArray.map((inputElement) => {
		return getMovieData(inputElement.value);
	});

	Promise.all(moviePromises)
		.then((promiseData) => {
			promiseData.map((items) => {
				console.log(items);
				items.map((item) => {
					let wrapper = document.createElement('div');
					let img = document.createElement('img');
					wrapper.setAttribute('class', 'col p-2');
					img.src = `${imgUrl}${item.poster_path}`;
					wrapper.appendChild(img);

					document.getElementById('movies').appendChild(wrapper);
				});
			});
		})
		.catch((error) => {
			console.log(error);
		});
});
