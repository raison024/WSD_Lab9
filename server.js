const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const {stringify} = require("nodemon/lib/utils");
const app = express();

let fileNameTemp = '';

//To grab information that is posted, we need to use the following statement
app.use(bodyParser.urlencoded({extended: true}));

//to use res.render, we need to install and import ejs module
app.engine('html', require('ejs').renderFile);

const port = 3000;

app.listen(port, ()=>{
    console.log('Server is listening on port '+port);
});

app.use(express.static(__dirname + "/"));

app.get("/", (req,res)=>{
   res.sendFile(__dirname + "/index.html");
});

app.get("/read", (req,res)=>{
   res.sendFile(__dirname + "/read.html");
});

app.get("/edit", (req,res)=>{
    res.sendFile(__dirname + "/edit.html");
});

app.post("/editFile", (req,res)=>{
    //Body parser is needed for using req.body
    let fileName = req.body.fileName;
    fileNameTemp = fileName;
    //Reading file
    let data = fs.readFileSync(fileName+".json", 'utf-8');
    console.log(data);
    res.render(__dirname + "/editDisplay.html", {fileData: data, fileName: fileName});
});

app.post("/readFile", (req,res)=>{
    //Body parser is needed for using req.body
    let fileName = req.body.fileName;

    //Reading file
    let data = fs.readFileSync(fileName+".json", 'utf-8');
    console.log(data);
    res.render(__dirname + "/fileDisplay.html", {fileData: data, fileName: fileName});
});

app.post("/appendData", (req,res)=>{
    //Body parser is needed for using req.body
    let sentData = req.body;
    let data = fs.readFileSync(fileNameTemp+".json", 'utf-8');
    data = JSON.parse(data.toString());
    let content =  {"name":`${sentData.name}`, "category":`${sentData.category}`,"price":`${sentData.price}`};

    data.push(content);

    let newData = JSON.stringify(data);
    console.log(newData);

    fs.writeFileSync(fileNameTemp+".json", newData, err=>{
        if(err) {
            console.log(err);
        }
    })

    res.render(__dirname + "/editedFileDisp.html", {fileName: fileNameTemp, fileData: newData});
});

