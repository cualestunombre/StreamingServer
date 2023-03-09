본 프로젝트는 
http의 chunked transfer기술과 streaming기술에 대한
기본 코드를 작성하는 것이 목적입니다
<br>
<br>
<사용법> 
  1. 코드를 다운 받고 npm install을 합니다.
  2. 콘솔을 통해 해당 디렉토리로 이동한 후 node app.js를 실행합니다.
  3. '127.0.0.1:9000'을 들어가서 실시간 스트리밍 동영상을 볼 수 있습니다.
  4. '127.0.0.1:9000/partial'을 들어가서 chunked된 데이터를 받아 볼 수 있습니다.
<br>
<사용법/>
<br>
<br>

먼저 chunked transfer기술 부터 알아봅시다 app.js를 실행시키고
브라우저를 통해 /partial로 들어가게 되면,
글자들이 한번에 화면에 표시되는 것이 아닌, 
조금씩 화면에 표시되는 것을 볼 수 있습니다. 
이는, 서버에서 하나의 http응답을 여러개의 엔티티로 
쪼개어, 전송하는 것입니다. 그러나 여러개의 http응답이 
아닌 하나의 http응답이라는 것에 유의 하여야 합니다.
실제로, chatgpt는 해당 기술을 사용하여, 
응답이 생성되는 만큼 chunk data를 클라이언트에게
답변을 전송합니다. 자세한 원리는 app.js의 코드를 참조하세요!
<img width="100%" src="https://user-images.githubusercontent.com/47946305/223950865-ce32392d-2f0d-448b-a908-ddd21b28ecf8.gif">


두번째로, 스트리밍 기술에 대해 알아봅시다
app.js의 코드를 확인하면 '/'로 접속시 html을 받게
되고, 이 html에는 비디오 태그가 있습니다. 
이 비디오는 처음부터 모든 데이터를 가져오는 것이 아닌,
조각으로 데이터를 가져 옵니다. 
app.js의 /video를 보면, 클라이언트가 보내는 첫 요청에는 
range가 정의 되있지 않아, 서버가 content-type과 
content-length에 대한 정보를 클라이언트에게 보내게 됩니다. 브라우저는 이를 확인하여, 다음 요청부터 
요청시 range에 대한 정보를 서버로 보내게 되고,
else에 해당하는 로직이 실행됩니다. 그리고 
MAX_CHUNK에 해당하는 만큼으로, contents의 크기를
제한하여, 스트림의 파이프를 통해 클라이언트에게 
응답하게 됩니다.(스트림의 파이프는 응답헤더를 인식하여,
파일을 읽고, content range에 해당하는 만큼의 데이터를 클라이언트에게 전송합니다) 이때 http코드는 206 partial-content
입니다. 유의할 점은 모든 응답은 독립적인 http응답입니다. 

<img width="100%" src="https://user-images.githubusercontent.com/47946305/223954444-ec93c999-604c-414d-89ef-691b56d29084.gif">
