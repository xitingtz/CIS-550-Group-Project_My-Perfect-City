const express = require('express');
const mysql  = require('mysql');


const routes = require('./routes')
const config = require('./config.json')

const app = express();

app.get('/Job_Market_Grade', routes.Job_Market_Grade)
app.get('/search_by_job_count/:PostCountLow', routes.search_by_job_count)
app.get('/Order_By_Job_Count', routes.Order_By_Job_Count)
app.get('/job_post', routes.job_post)
app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
