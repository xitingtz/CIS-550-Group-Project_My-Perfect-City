const express = require('express');
const mysql  = require('mysql');


const routes = require('./routes')
const config = require('./config.json')

const app = express();

app.get('/Job_Market_Grade', routes.Job_Market_Grade)
app.get('/search_by_job_count/:PostCountLow', routes.search_by_job_count)
app.get('/Order_By_Job_Count', routes.Order_By_Job_Count)
app.get('/job_post', routes.job_post)

//cici's code
app.get('/search_cities/vaccination', routes.search_cities_by_vaccination)
app.get('/rank_cities', routes.search_cities_by_vaccination)
app.get('/rank_cities_by_vaccination_rate', routes.rank_cities_by_vaccination_rate)

//xiting's code
app.get('/search_by_crime_rate', routes.search_by_crime_rate)
app.get('/safety_grade', routes.safety_grade)
app.get('order_by_crime_rate', routes.order_by_crime_rate)
app.get('data_by_city', routes.data_by_city)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;