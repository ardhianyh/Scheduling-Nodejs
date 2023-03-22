require('dotenv').config();
const { listIP } = require('./ip');

exports.filterIP = (req, res, next) => {
   const env = process.env.APP_ENV;
   next();
   return;
};

exports.verifyToken = (req, res, next) => {
   const bearerHeader = req.headers['authorization'];
   if (bearerHeader == undefined) { return res.status(401).json({ isSuccess: false, message: 'Invalid Authorization' }) }
   else {
      const bearerToken = bearerHeader.split(' ')[1];
      if (bearerToken !== process.env.APP_TOKEN) return res.status(401).json({ message: 'Invalid Authorization' })
   }
   next();
   return;
}