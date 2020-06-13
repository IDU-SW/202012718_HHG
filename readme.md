202012718 HHg 통신규약
==========================
## 기본URL ===> /games
### JSON 데이터 구조 
####    {
####      "id":1,
####      "title":"게임이름",
####      "publisher":"배급사",
####      "year":발급년도
####    }

* Get
  - 데이터 목록 조회
    + 필요파라미터 : 없음
    + 예시 : localhost:3000/games
  - 데이터 상세 조회
    + 필요파라미터 : id
    + 예시 : localhost:3000/games/1
* Post
  - 데이터 추가
    + 필요파라미터 : title, publisher, year
    + 예시 : { "title": "마리오", "publisher": "nintendo", "year": 2020 }
* Put
  - 데이터 수정
    + 필요파라미터 : id, title, publisher, year
    + 예시 : { "id":1, "title": "마리오", "publisher": "nintendo", "year": 2020 }
* Put
  - 데이터 삭제
    + 필요파라미터 : id
    + 예시 : { "id":"1" }

* 인증된 유저정보
<pre>
<code>
  user = {
    id : 'hgHong',
    password : 'cometure',
    name : '홍현교'
  }
</code>
</pre>