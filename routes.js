const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// search by job count
async function search_by_job_count(req, res) {

    const PostCountLow = req.query.PostCountLow? req.query.PostCountLow : 0;
        connection.query(`SELECT locality as city, COUNT(_id) as num_of_jobs
        from JOB_POSTS
        group by city
        HAVING COUNT(_id) >= ${PostCountLow}
        order by num_of_jobs DESC;
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// search by crime rate(Xiting)
async function search_by_crime_rate(req, res) {
    var crimeRateLow = req.query.crimeRateLow ? req.query.crimeRateLow : 0
    var query =`
    SELECT ct.city, ct.state_id, cr.crime_rate_per_100000
    FROM US_Cities ct JOIN CRIME_RATE cr ON ct.county_fips = cr.fips_county
    WHERE cr.crime_rate_per_100000 <= ${crimeRateLow}
    ORDER BY crime_rate_per_100000;
    `;
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            if(results.length == 0){
                res.json({ results: []})
            } else {
                res.json({ results: results })
            }
        }
    });
}



// Job_Market_Grade
async function Job_Market_Grade(req, res) {

    const locality = req.query.locality;
    const region = req.query.region;
        connection.query(`SELECT region, locality as city,
        CASE
        WHEN COUNT(_id) >= 49 THEN 'A'
        WHEN COUNT(_id) >= 39 AND COUNT(_id) < 49 THEN 'B'
        WHEN COUNT(_id) >= 29 AND COUNT(_id) < 39 THEN 'C'
        WHEN COUNT(_id) >= 19 AND COUNT(_id) < 29 THEN 'D'
        WHEN COUNT(_id) >= 9 AND COUNT(_id) <  19 THEN 'E'
        ELSE 'F'
    END AS JOB_MARKET_GRADE
 FROM JOB_POSTS
 WHERE locality = '${locality}' AND region = '${region}';
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

//crime rate grade(Xiting)
async function safety_grade(req, res) {
    var city = req.query.city;
    var stateID = req.query.stateID;
    var query =`
    SELECT city, state_id, crime_rate_per_100000,
       CASE
       WHEN crime_rate_per_100000 >= 0 AND crime_rate_per_100000 < 200 THEN 'A'
       WHEN crime_rate_per_100000 >=200 AND crime_rate_per_100000 < 400 THEN 'B'
       WHEN crime_rate_per_100000 >=400 AND crime_rate_per_100000 < 600 THEN 'C'
       WHEN crime_rate_per_100000 >=600 AND crime_rate_per_100000 < 800 THEN 'D'
       WHEN crime_rate_per_100000 >=800 AND crime_rate_per_100000 < 1000 THEN 'E'
       ELSE 'F'
       END AS Safety_Grade
    FROM CRIME_RATE cr JOIN US_Cities ct ON cr.fips_county = ct.county_fips
    WHERE city = ${city} AND state_id = ${stateID};
    `;
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            if(results.length == 0){
                res.json({ results: []})
            } else {
                res.json({ results: results })
            }
        }
    });
}

// page 4 order by job count
async function Order_By_Job_Count(req, res) {

        connection.query(`SELECT locality as city, COUNT(_id) as num_of_jobs
        from JOB_POSTS
        group by city
        order by num_of_jobs DESC
        limit 10;`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// page 4 order by crime rate(Xiting)
async function order_by_crime_rate(req, res) {
    var num_of_cities = req.query.num_of_cities? req.query.num_of_cities : 10;
    var query =`
    WITH Top_City_By_County AS (
        SELECT city, ct.state_id, ct.county_fips, ct.population
        FROM US_Cities ct
        INNER JOIN (
            SELECT county_fips, MAX(population) AS max_population
            FROM US_Cities
            GROUP BY county_fips
            ) m
       ON ct.county_fips = m.county_fips AND ct.population = m.max_population
       )
      
     SELECT city, state_id, crime_rate_per_100000
     FROM CRIME_RATE cr JOIN Top_City_By_County ct ON cr.fips_county = ct.county_fips
     WHERE crime_rate_per_100000 > 0
     ORDER BY crime_rate_per_100000
     LIMIT ${num_of_cities};
     
    `;
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            if(results.length == 0){
                res.json({ results: []})
            } else {
                res.json({ results: results })
            }
        }
    });
}

// page 5 job_post
async function job_post(req, res) {

    const locality = req.query.locality;
        connection.query(`SELECT locality as city, COUNT(_id) as num_of_jobs
        FROM JOB_POSTS
        WHERE locality LIKE "%${locality}%"
        GROUP BY city;
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

//page 5 compare two cities (Xiting)
async function data_by_city(req, res) {
    var city = req.query.city;
    var stateID = req.query.stateID;
    var query =`
    WITH JOB_COUNT AS (
        SELECT locality AS city, COUNT(_id) AS num_of_jobs
        FROM JOB_POSTS
        GROUP BY city
    )
    SELECT c.city, s.state_name, h.med_price, v.people_fully_vaccinated_per_hundred, cr.crime_rate_per_100000,
        j.num_of_jobs
    FROM US_Cities c
    JOIN US_States s ON c.state_id = s.state_id
    JOIN VACCINATION v ON v.state_name = s.state_name
    JOIN HOUSE_PRICE h ON h.state = c.state_id
    JOIN CRIME_RATE cr ON cr.fips_county = c.county_fips
    JOIN JOB_COUNT j ON j.city = c.city
    WHERE c.city LIKE "${city}" AND c.state_id LIKE "${stateID}"
    `;
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            if(results.length == 0){
                res.json({ results: []})
            } else {
                res.json({ results: results })
            }
        }
    });
}

// Cici's code: Page 2 - Search Mode - search cities by vaccination with minimum rate 
async function search_cities_by_vaccination(req, res) {

    const minimum_vaccination_rate = req.query.minimum_vaccination_rate? req.query.minimum_vaccination_rate : 0;
        connection.query(`SELECT c.city, s.state_name, v.people_fully_vaccinated_per_hundred
        from US_Cities c
        join US_States s on c.state_id = s.state_id
        join VACCINATION v on v.state_name = s.state_name
        where v.people_fully_vaccinated_per_hundred >= ${minimum_vaccination_rate}
        order by v.people_fully_vaccinated_per_hundred desc;
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// Cici's code: Page 3 - City Rank Mode - rank criterias for a single city criterias 
async function rank_cities(req, res) {

    const city_name = req.query.city_name;
    const state_id = req.query.state_id;
    connection.query(`SELECT c.city, c.state_id, x.vaccination_rank, job_rank, crime_rank
    from US_States s
    join US_Cities c on c.state_id = s.state_id
    join
    # join vaccination rate ranking table
    (select *,
    RANK() over (
    order by v.people_fully_vaccinated_per_hundred desc
    ) vaccination_rank
    from VACCINATION v) x on x.state_name = s.state_name
    # join job ranking table
    join
    (select locality, COUNT(_id),
    RANK() over (
    order by COUNT(_id) desc
    ) job_rank
    from JOB_POSTS
    group by locality) j on j.locality = c.city
    # join crime ranking table
    join (select city, state_id,
    rank() over (
    order by crime_rate_per_100000) crime_rank
    from (SELECT city, state_id, crime_rate_per_100000
    FROM CRIME_RATE cr JOIN
    (   SELECT city, ct.state_id, ct.county_fips, ct.population
        FROM US_Cities ct
        INNER JOIN (
            SELECT county_fips, MAX(population) AS max_population
            FROM US_Cities
            GROUP BY county_fips
            ) m
        ON ct.county_fips = m.county_fips AND ct.population = m.max_population) ct
    ON cr.fips_county = ct.county_fips
    ORDER BY crime_rate_per_100000) crime_temp_table
    group by city, state_id
    ) cr on (cr.city = c.city and cr.state_id = c.state_id)
    where c.city = ${city_name} and s.state_id = ${state_id};        
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Cici's code: page 4 Criteria Rank Mode - rank top 10 cities by vaccination rate
async function rank_cities_by_vaccination_rate(req, res) {

    connection.query(`WITH VACCINATION_MAP as (
    SELECT VACCINATION.state_name as state_name, VACCINATION.people_fully_vaccinated_per_hundred as vaccination_rate, state_id
    FROM VACCINATION
    INNER JOIN US_States ON US_States.state_name = VACCINATION.state_name
    ORDER BY people_fully_vaccinated_per_hundred DESC
    ), TOP_CITY AS(
    SELECT city, ct.state_id, ct.population
    FROM US_Cities ct
    INNER JOIN (
    SELECT state_id, MAX(population) AS max_population
    FROM US_Cities
    GROUP BY state_id) m
    ON ct.state_id = m.state_id AND ct.population = m.max_population)
    SELECT TOP_CITY.state_id as state_id, city, population, vaccination_rate
    FROM TOP_CITY
    INNER  JOIN VACCINATION_MAP ON VACCINATION_MAP.state_id = TOP_CITY.state_id
    ORDER by vaccination_rate DESC
    limit 10;
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

//Yugui's Code: Page 2 Search by house price
async function search_mode(req, res) {

    // const pagesize = req.params.pagesize ? parseInt(req.params.pagesize) : 10
    const lower_bound = req.query.lower ? parseInt(req.query.lower) : 0
    const higher_bound = req.query.lower ? parseInt(req.query.higher) : 0

    // Search by House Price
    if (req.params.choice === 'house price') {
        connection.query(`SELECT county AS City, med_ppsf AS Med_Price_Per_SF, state AS State  
        FROM HOUSE_PRICE
        WHERE med_ppsf >= ${lower_bound} AND med_ppsf <= ${higher_bound} 
        ORDER BY med_ppsf DESC`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    } else {
        res.json({ message: `Error` })
    }
}

//Yugui's Code: Page 3 Descriptive Ranking by House Price
async function rank_by_house_price(req, res) {
    const city_name = req.query.city ? req.query.city : ''
    connection.query(`SELECT county AS City, state AS State, med_ppsf AS Med_Price_Per_SF,
        CASE
        WHEN med_ppsf >= 700 THEN 'Super Expensive'
        WHEN med_ppsf >= 500 AND COUNT(_id) < 700 THEN 'Expensive'
        WHEN med_ppsf >= 300 AND COUNT(_id) < 500 THEN 'Average'
        WHEN med_ppsf >= 100 AND COUNT(_id) < 300 THEN 'Cheap'
        WHEN med_ppsf >= 0 AND COUNT(_id) <  100 THEN 'Super Cheap'
        ELSE ' '
        END AS House_Price_Grade
    FROM HOUSE_PRICE
    WHERE county LIKE '%${city_name}%'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        } else {
            res.json({})
        }
    }); 
}

//Yugui's Code: Page 4 Criteria Search by House Price
async function order_by_house_price(req, res) {

    const num_of_results = req.query.num ? parseInt(req.query.num) : 10
    //HOUSE PRICE PER AREA DESCENDING
    if (req.params.choice === 'ppsf desc') {
        connection.query(`SELECT county, state, med_ppsf
        FROM HOUSE_PRICE
        ORDER BY med_ppsf DESC
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    //HOUSE PRICE PER AREA ASCENDING
    } else if (req.params.choice === 'ppsf asce'){
        connection.query(`SELECT county, state, med_ppsf
        FROM HOUSE_PRICE
        WHERE med_ppsf IS NOT NULL
        ORDER BY med_ppsf
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    //HOUSE LISTING
    } else if (req.params.choice === 'Listed House'){
        connection.query(`SELECT county, state, ave_listing
        FROM HOUSE_PRICE
        ORDER BY ave_listing DESC
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    // HOUSE SOLD
    } else if (req.params.choice === 'Sold House'){
        connection.query(`SELECT county, state, ave_Sold
        FROM HOUSE_PRICE
        ORDER BY ave_Sold DESC
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    //IF YOU WANT TO BUY YOU SHOULD GO..
    } else if (req.params.choice === 'Buyers Market'){
        connection.query(`SELECT county, state, ave_listing/ave_Sold AS listing_sold_ratio
        FROM HOUSE_PRICE
        ORDER BY ave_listing/ave_Sold DESC
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    //IF YOU WANT TO SELL YOU SHOULD GO..
    } else if (req.params.choice === 'Sellers Market'){
        connection.query(`SELECT county, state, ave_listing/ave_Sold AS listing_sold_ratio
        FROM HOUSE_PRICE
        WHERE ave_listing IS NOT NULL
        AND ave_Sold IS NOT NULL
        ORDER BY ave_listing/ave_Sold        
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    //IF YOU WANT TO GO SOMEWHERE WITH HIGHEST RAISING AMOUNT
    } else if (req.params.choice === 'Go To the Moon Market'){
        connection.query(`SELECT county, state, med_listing_ppsf - med_ppsf AS list_sold_difference
        FROM HOUSE_PRICE
        ORDER BY med_listing_ppsf - med_ppsf DESC        
        LIMIT ${num_of_results}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } else {
                res.json({})
            }
        });
    } else {
        res.json({ message: `Error` })
    }
}

//Yugui's Code: Page 5 Compare two City by house price
async function compare_by_house_price(req, res) {

    const city_A = req.query.city_A ? parseInt(req.query.city_A) : ''
    const city_B = req.query.city_B ? parseInt(req.query.city_B) : ''

    connection.query(`SELECT county, state, med_price
    FROM HOUSE_PRICE
    WHERE county LIKE "%${city_A}%" OR county LIKE "%${city_B}%"
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        } else {
            res.json({})
        }
    }); 
}

module.exports = {
    search_by_job_count,
    Job_Market_Grade,
    Order_By_Job_Count,
    job_post,
    search_cities_by_vaccination,
    rank_cities,
    rank_cities_by_vaccination_rate,
    search_by_crime_rate,
    safety_grade,
    order_by_crime_rate,
    data_by_city,
    search_mode,
    rank_by_house_price,
    order_by_house_price,
    compare_by_house_price
}