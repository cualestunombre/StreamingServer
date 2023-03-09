본 프로젝트는 
http의 chunked transfer기술과 streaming기술에 대한
기본 코드를 작성하는 것이 목적입니다


먼저 app.js를 실행시키고
브라우저를 통해 /partial로 들어가게 되면,
글자들이 한번에 화면에 표시되는 것이 아닌, 
조금씩 화면에 표시되는 것을 볼 수 있습니다. 
이는, 서버에서 하나의 http응답을 여러개의 엔티티로 
쪼개어, 전송하는 것입니다. 그러나 여러개의 http응답이 
아닌 하나의 http응답이라는 것에 유의 하여야 합니다.
<img width="100%" src="https://user-images.githubusercontent.com/47946305/223950865-ce32392d-2f0d-448b-a908-ddd21b28ecf8.gif">

