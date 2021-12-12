const express = require('express');
const mysql  = require('mysql');


const routes = require('./routes')
const config = require('./config.json')

const app = express();

app.get('/Job_Market_Grade', routes.Job_Market_Grade)
app.get('/search_jobCount', routes.search_by_job_count)
app.get('/Order_Job_Count', routes.Order_By_Job_Count)
app.get('/job_post', routes.job_post)
app.get('/search_cities_by_vaccination', routes.search_cities_by_vaccination)
app.get('/search/cityName', routes.rank_cities)
app.get('/rank_cities_by_vaccination_rate', routes.rank_cities_by_vaccination_rate)
app.get('/search/crimeRate', routes.search_by_crime_rate)
app.get('/safety_grade', routes.safety_grade)
app.get('/order/crimeRate', routes.order_by_crime_rate)
app.get('/compare/city', routes.data_by_city)
app.get('/search/rent', routes.search_by_rent)
app.get('/order/rent',routes.order_by_rent)
app.get('/search/criterias', routes.search_by_criterias)
app.get('/search/:criteria', routes.search_mode)
app.get('/rank/house_price', routes.rank_by_house_price)
app.get('/order/house_price/:choice', routes.order_by_house_price)
app.get('/compare', routes.compare)
app.get('/all_cities', routes.all_cities)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
