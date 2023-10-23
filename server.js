import express, { request } from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "trafiexample"  // MySQL-database
});


con.connect((err) => {
    if (err) 
    {
        console.log(err)
    }else{
    console.log("Connected!");
    }
});

  
// Load html start file to browser

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});



// Get DB table to html table.

app.get("/list", (req, res) => {

    var r;
    var result;
    con.query('SELECT * FROM vehdata',
    function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
                r = JSON.parse(JSON.stringify(result))

        res.send(r);
            }
    });
    return
});

//  Load JSON file to database

app.post("/loadjson", (req, res) => {
 
    const fname1 = req.body.file;
    var data2 = [];
    const fname = (__dirname +"/"+ fname1)

        // Load file data to buffer
    fs.readFile(fname, function (err, data) {
        if (err) {
           return console.error(err);
        }
        data2 = data.toString();
        data2 = JSON.parse(data)

        // Write data from buffer to database
        data2.forEach(element => {
             const model_year = element.model_year;
             const make = element.make;
             const model = element.model;
             const rejection_percentage = element.rejection_percentage;
             const reason_1 = element.reason_1;
             const reason_2 = element.reason_2;
             const reason_3 = element.reason_3;
             con.query('INSERT INTO vehdata VALUES (?,?,?,?,?,?,?)',
                     [model_year,make,model,rejection_percentage,reason_1,reason_2,reason_3], (err, result) => {
                 if(err)
                 {
                     return res.send(err);
                 }
             })
         }); 
     });      
     return;
})


app.listen(3000,(err) => {
    if(err)
    {
        console.log(err)
    }else{
        console.log("on port 3000")
    }
});
