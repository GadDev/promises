const dotenv = require('dotenv');
dotenv.config();


const apiKey = process.env.API_KEY;
const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const imgUrl = `http://image.tmdb.org/t/p/w300/`;
const peopleUrl = `https://api.themoviedb.org/3/person`;
const castUrl = `https://api.themoviedb.org/3/movie`;
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

function getCast(movie) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${castUrl}/${movie.id}/credits?api_key=${apiKey}`,
			method: 'get',
			success: (castData) => {
				resolve(castData.cast[0]);
			},
			error: (error) => console.log(error.responseJSON.status_message),
		});
	});
}

function getPerson(person) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${peopleUrl}/${person.id}?api_key=${apiKey}`,
			method: 'get',
			success: (personData) => {
				resolve(personData);
			},
			error: (error) => console.log(error.responseJSON.status_message),
		});
	});
}
function removeCard() {
	const parent = document.getElementById('movies');
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
function createCard(imagePath, desc) {
	let wrapper = document.createElement('div');
	let img = document.createElement('img');
	let title = document.createElement('h3');
	title.innerText = desc;
	wrapper.setAttribute('class', 'col p-2');
	img.src = `${imgUrl}${imagePath}`;
	wrapper.appendChild(img);
	wrapper.appendChild(title);

	document.getElementById('movies').appendChild(wrapper);
}

document.getElementById('movie-form').addEventListener('submit', (event) => {
	event.preventDefault();
	const movieElement = Array.from(
		document.getElementsByClassName('movie-title')
	);

	const movieChainedPromises = movieElement.map((inputElement) => {
		return getMovieData(inputElement.value)
			.then((movieData) => {
				return getCast(movieData[0]);
			})
			.then((castInfo) => {
				return getPerson(castInfo);
			})
			.then((personData) => {
				return personData;
			});
	});
	Promise.all(movieChainedPromises).then((promisesData) => {
		console.log(promisesData);
		removeCard();
		promisesData.map((item) => {
			console.log(item);
			createCard(item.profile_path, item.name);
		});
	});
});
