import config from './config.json'

//sample code from HW2
const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

// Compare Route
const compare = async (city) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare?CityA=${city_A}&CityB=${city_B}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    // search_by_job_count,
    // Job_Market_Grade,
    // Order_By_Job_Count,
    // job_post,
    // search_cities_by_vaccination,
    // rank_cities,
    // rank_cities_by_vaccination_rate,
    // search_by_crime_rate,
    // safety_grade,
    // order_by_crime_rate,
    // data_by_city,
    // search_mode,
    // rank_by_house_price,
    // order_by_house_price,
    compare
}