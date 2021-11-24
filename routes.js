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

    const jobPostCountLow = req.query.PostCountLow? req.query.PostCountLow : 0;
        connection.query(`SELECT locality as city, COUNT(_id) as num_of_jobs
        from JOB_POSTS
        group by city
        HAVING COUNT(_id) >= ${jobPostCountLow}
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
 WHERE locality = ${locality} AND region = ${region};
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
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



module.exports = {
    search_by_job_count,
    Job_Market_Grade,
    Order_By_Job_Count,
    job_post
}