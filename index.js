const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const server = http.createServer(async (req,res)=>{
    res.setHeader('Content-Type','text/html');
if(req.method == "POST"){
    if(req.url == "/form"){
        var raw = [];
    req.on("data",(ch)=>{
        raw.push(ch);
    });
    req.on("end",async ()=>{
      const data = Buffer.concat(raw).toString();
      var data1 = data.split("&");
      var jData = {}; 
      for(let i = 0; i < data1.length; i++){
       var kv = data1[i].split("=");
       jData[kv[0]] = kv[1];
      }
      const FinalData = JSON.stringify(jData);
      const file = await fsp.open("form.db","a+");
      file.write(FinalData+",\n\r");
      file.close();
      res.write("Form Submited")
     res.statusCode = 200; 
     res.end();  
    });
   
     
 }
}else{
    if(req.url == "/form"){
    
        fs.readFile("form.html",(err,data)=>{
            if(err) throw err;
            res.write(data);
            res.statusCode = 200; 
            res.end();
           });
          
          
           }else if(req.url == "/res"){
            res.setHeader("Content-Type","text/json");
            res.setHeader("Access-Control-Allow-Origin","*");
        const file = await fsp.open("form.db","r");
        res.write("[");
        var jw = "";
         for await (const line of file.readLines()){
            jw += line;
            
         }
         jw = jw.substring(0,jw.length -1);
         res.write(jw); 
         res.write("]");
         res.statusCode = 200;
         res.end();
           }
}
});

server.listen(801,'127.0.0.1',()=>{
    console.log("up and running!");
});



