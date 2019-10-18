var spawn = require("child_process").spawn,child;
const { parse } = require('querystring');
const csv = require('csv-parser');
const fs = require('fs');

var myData = [];
var i = 0;
var array = []


var http = require('http');
http.createServer(function (req, res) {
 if (req.method === 'POST') {
res.writeHead(200, {'Content-Type': 'text/html'});
var username = "";
collectRequestData(req, result => {
		username = "" + result.username;
		 
        });
child = spawn("powershell.exe",["C:\\users\\administrator\\desktop\\script.ps1 \-LastLogonOnly \| Export-Csv result.csv"]);
child.stdout.on("data",function(data){
    myData.push(" " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
array = [];
i=0;
fs.createReadStream('result.csv')
  .pipe(csv())
  .on('data', (row) => {
    array[i]=row;
    i++;
  })
  .on('end', () => {
   res.write(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style type="text/css">
  table, td, th {  
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 15px;
body {
  font-family: Arial;
}

* {
  box-sizing: border-box;
}

form.example input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 80%;
  background: #f1f1f1;
}

form.example button {
  float: left;
  width: 20%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none;
  cursor: pointer;
}

form.example button:hover {
  background: #0b7dda;
}

form.example::after {
  content: "";
  clear: both;
  display: table;
}
</style>
</head>

<body>
<form class="example" method="POST" action="/" style="margin:auto;max-width:300px">
  <input type="text" placeholder="Search.." name="username">
  <button type="submit"><i class="fa fa-search"></i></button>
</form>

<table>
  <tr>
    <th>Time</th> 
    <th>User</th>
	<th>Workstation</th>
	<th>IP</th
  </tr> `);

for(let i = 1; i < array.length; i++){ 

if( (array[i][2].toString() == username) || (username == "*")){
res.write("<tr>");
 res.write("<td>" + array[i][1] + "</td>");
 res.write("<td>" + array[i][2] + "</td>");
 res.write("<td>" + array[i][4] + "</td>");
 res.write("<td>" + array[i][5] + "</td>");
 res.write("</tr>");
}


}


res.end(`</html>`);
  
 });

});
child.stdin.end();



	
     
    }
else{
res.end(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style type="text/css">
body {
  font-family: Arial;
}

* {
  box-sizing: border-box;
}

form.example input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 80%;
  background: #f1f1f1;
}

form.example button {
  float: left;
  width: 20%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none;
  cursor: pointer;
}

form.example button:hover {
  background: #0b7dda;
}

form.example::after {
  content: "";
  clear: both;
  display: table;
}
</style>
</head>

<body>
<form class="example" method="POST" action="/" style="margin:auto;max-width:300px">
  <input type="text" placeholder="Search.." name="username">
  <button type="submit"><i class="fa fa-search"></i></button>
</form>

</body>
</html>`);

}
}).listen(8080);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}





