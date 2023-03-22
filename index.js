require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const compression = require('compression');
const schedule = require('node-schedule');
const axios = require('axios');

const { filterIP, verifyToken } = require('./middleware');
const logger = require('./log');

const app = express();
const port = process.env.PORT || 5050;
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', [filterIP, verifyToken], (req, res) => {
   const { time, data } = req.body;
   logger.info(`schedule request ${time} - ${JSON.stringify(data.action)}`);
   console.log(`schedule request to ${data.action} at ${time}`);

   schedule.scheduleJob(time, function (y) {
      console.log(`request to ${data.action} at ${time}`);
      axios.post(data.action, data.data)
         .then(result => {
            console.log(result.data)
            logger.info(`success request ${time} - ${JSON.stringify(result.data)}`);
         })
         .catch(error => {
            console.log(error)
            logger.error(`error request ${time} - ${JSON.stringify(result.data)}`);
         });
   }.bind(null, data));
   res.json({ message: "success" });
})

app.use((req, res) => {
   res.status(400);
   res.send({ error: "Not Found" })
})

app.listen(port, () =>
   console.log(`Server up and listen port ${port}`)
);