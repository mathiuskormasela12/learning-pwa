
const apiUrl = 'http://192.168.1.34:3000/api/members';

async function render(response) {

	const data = document.getElementById('data');

	for(const member of response.results) {
		const list = document.createElement('li');
		const text = document.createTextNode(member.name);
		list.appendChild(text);
		data.appendChild(list);
	}
}

let networkDataReceived = false;

// Refresh data from online
const networkUpdate = fetch(apiUrl)
											.then(response => response.json())
											.then(response => {
												networkDataReceived = true;
												render(response);
											});

// Return data from caches
caches.match(apiUrl)
.then((response) => {
	if(!response) throw Error('no data from caches');
	return response.json();
})
.then(response => {
	if(!networkDataReceived) {
		render(response);
		console.log('render data from cache');
	}
})
.catch(() => {
	return networkUpdate;
});

// PWA
// This code will check if your browser has support PWS or not
if('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/serviceworker.js')
		.then((registration) => {
			console.log('Service Worker has been registred successfully with scope', registration.scope);
		})
		.catch(err => {
			console.log('Service Worker has failed to register', err);
		})
	});
}