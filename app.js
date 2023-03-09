const express=require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(morgan("dev"));
app.set("view engine", "ejs");

app.get("/",(req,res,next)=>{
    const html = fs.readFileSync("./views/main.ejs");
    res.status(200).header({"Content-Type":"text/html"}).send(html);
});

app.get("/partial",(req,res)=>{
    res.render("ptest");
});
/* 서버에서 chunked encoding기술을 사용해, 하나의 
http요청을 분할해서 클라이언트로 전송하는 방법에 대한 예시 입니다.
chatgpt가 어떤 방식으로, 응답을 분할해서 보낼까 궁금하여 알아보게 되었는데,
chatgpt또한, chunked encoding 기술을 사용해, 답변을 전송합니다.
*/
app.get("/partialData",(req,res,next)=>{
    const file = fs.readFileSync("./text.txt");
    const data = file.toString(); //text파일을 읽어와서 스트링으로 변환합니다
    res.writeHead(200,{'Content-Type':'text/plain',
    'Transfer-Encoding':'chunked'}); //http헤더에 chunked를 명시해야 합니다
    let index = 0;
    const intervalId = setInterval(()=>{
        if(index>=data.length){
            clearInterval(intervalId);
            res.end(); // 이때 모두 다 읽었다면, res.end()를 통해 http통신의 끝을 알립니다.
            return;
        }
        const chunk = data.slice(index,index+1);
        index+=1;
        res.write(chunk);
        return;
    },30); //0.03초마다 data를 1글자식 읽어와서 res.write()를 통해 클라이언트로 전송합니다.

    
});

/* http로 스트리밍 서버를 구축하는 기초적인 코드입니다. 
위의 chunked encoding과는 다르게, 독립적인 http 요청에 대한,
독립적인 http응답이 이뤄집니다.
*/
app.get("/video",(req,res,next)=>{
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
        const chunk = end-start+1;
        res.writeHead(206,{"cache-control":"max-age=60",'Content-Type':'video/mp4','Content-Length':chunk,
        'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${fileSize}`
        });
        const readStream = fs.createReadStream(path,{start,end});
        readStream.pipe(res);
    }
});   



app.listen(9000,'0.0.0.0');