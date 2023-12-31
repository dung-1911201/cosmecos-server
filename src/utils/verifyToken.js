const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
			if (err) {
				console.log('error:', err);
				res.status(500).json('token is not valid !');
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).json('you are not authenticated !');
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin || req.user.id === req.params.id) {
			next();
		} else {
			res.status(403).json('You are not allowed to do that !');
		}
	});
};

const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json('You are not allowed to do that !');
		}
	});
};

module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization };
