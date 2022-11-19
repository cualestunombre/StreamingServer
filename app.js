const express=require("express");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
app.use(morgan("dev"));


app.get("/",(req,res,next)=>{
    const path = './uploads/blackpink.mov';
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range=req.headers.range;
    if(!range){
        const header = {'Content-Type':'video/mp4','Content-Length':fileSize};
        res.writeHead(200,header);
        return res.end();
    }
    else{
        const MAX_CHUNK_SIZE = 1000*1000;
        const parts = range.replace(/bytes=/,"").split("-");
        const start = parseInt(parts[0]);
        const _end = parts[1] ? parseInt(parts[1]) : fileSize-1;
        const end = Math.min(_end,start + MAX_CHUNK_SIZE-1);
        res.writeHead(206,{'Content-Type':'video/mp4','Content-Length':fileSize,
        'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${fileSize}`
        });
        const readStream = fs.createReadStream(path,{start,end});
        readStream.pipe(res);
    }
});   



app.listen(9000,()=>{
    console.log("9000번 포트 OPEN");
});