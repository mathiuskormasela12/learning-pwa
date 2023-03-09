// ========== Server
const http = require('http');
const url = require('url');

const gfriendMembers = [
	{
		id: 1,
		name: 'Kim Sojung',
		birth: '07 December 1995'
	},
	{
		id: 2,
		name: 'Jung Yerin',
		birth: '19 August 1996'
	},
	{
		id: 3,
		name: 'Jung Eunbi',
		birth: '30 May 1997'
	},
	{
		id: 4,
		name: 'Choi Yuna',
		birth: '04 October 1997'
	},
	{
		id: 5,
		name: 'Hwang Eunbi',
		birth: '03 June 1998'
	},
	{
		id: 6,
		name: 'Kim Yewon',
		birth: '19 August 1998'
	},
];

const server = http.createServer((req, res) => {
	const path = url.parse(req.url, true).pathname;
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET",
		"Access-Control-Max-Age": 2592000, // 30 days
		/** add other headers as per requirement */
		'Content-Type': 'application/json'
	};

	switch(path) {
		case (req.method === 'GET' && '/api/members') :
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				message: 'Success get gfriend members',
				results: gfriendMembers
			}));
		break;

		default: 
			res.writeHead(404, headers);
			res.write(JSON.stringify({
				message: 'The API URL is not found'
			}))
	}

	res.end();
});

server.listen(3000, () => {
	console.log('The server is running at port 3000');
});