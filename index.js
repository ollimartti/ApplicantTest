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

let database = [];
let id = 100;

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

//GET list whole database (for future, not in use yet)

app.get("/public",(req, res) => {
    con.query("SELECT * FROM vehdata", function(err, result, fields){
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log(result)  //RowDataPacket
            var r = JSON.parse(JSON.stringify(result))
            console.log(r[0])
            return res.status(201).r;
        }       
    })
});


    // Get selected list to html table. Only Make column can use.

app.post("/getlist", (req, res) => {
    const textx = req.body.textinputx;

    console.log(textx);
    
    var searchText = textx;
    var countRows 

    var sql = ('SELECT COUNT(*) AS rowsCount FROM vehdata WHERE make LIKE ' + "'"+searchText+"%'");  
    con.query(sql, function(err, rows, fields) {
        if (err) throw err;
        console.log('Query result: ', rows[0].rowsCount);
        countRows = rows[0].rowsCount
        });

    con.query(('SELECT * FROM vehdata WHERE make LIKE ' + "'"+searchText+"%'"), function(err, result, fields){
        if(err)
        {
            console.log(err)
        }else{
                var r = JSON.parse(JSON.stringify(result))
            for (let i = 0; i < countRows; i++){
                console.log(r[i].make,  r[i].model)
            }
        }
        return res.send(r)
    }) 
});


//  File data load to database

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
