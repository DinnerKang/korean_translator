# Translator

변수, 함수, 클래스 이름이 영어로 생각 안날때 편하게 번역해주는 플러그인입니다.

1. 영어 번역 -> 한글
2. 한글 외 번역 -> 영어

#### Firebase Database 와 연동이 되었으며, 번역한 데이터를 수집 중 입니다.

원하지 않으시면 삭제해주세요 ㅠ  

**데이터 시각화 홈페이지 : [https://translator-c4119.firebaseapp.com/](https://translator-c4119.firebaseapp.com/)**

### 깃 스타는 개발자에게 힘입니다 !

## 특징

바로 번역하기 누르는 순간

![translate](/asset/translate.png)

짜잔 하고 번역합니다.

![translate](/asset/translate_1.png)

현재 Naver API 를 이용한 언어 감지 및 영어로 변역 입니다.  
### 만약 영어를 번역 시 한글로 나오는 기능도 추가했습니다.

배포 후 허용량이 자주 초과되면 그 후에 수정을...해보도록하겠습니다.

오픈소스 기여 목적으로 만들었습니다.  
악용은 자제 부탁드릴게요 !


## 제작자

#### 강전혁

- Email : jenhyuk0318@gmail.com
- Git : [https://github.com/DinnerKang](https://github.com/DinnerKang)
- Blog : [https://kdinner.tistory.com](https://kdinner.tistory.com)

## 도움을 주신분

##### 로고 제작 : 김수지 디자이너 (sooji901231@naver.com)

## 참고 자료

#### Git 코드 조각
[https://github.com/sculove/translator](https://github.com/sculove/translator)

[https://github.com/simple-factory/simple-translate/blob/5f69e031fadb3b08a9e6d236d405a35d6b1f5490/Translate.js](https://github.com/simple-factory/simple-translate/blob/5f69e031fadb3b08a9e6d236d405a35d6b1f5490/Translate.js)

[https://github.com/matthew-andrews/isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)

[https://www.npmjs.com/package/electron-fetch](https://www.npmjs.com/package/electron-fetch)

#### Kakao API
[https://developers.kakao.com/docs/restapi/translation](https://developers.kakao.com/docs/restapi/translation)

#### Naver API
[https://developers.naver.com/docs/papago/](https://developers.naver.com/docs/papago/)

## 릴리즈 노트

##### 0.4.x
 - 어뷰징 방지 함수 제작
 - 일부 특수문자 검열 코드
 - typescript 오류 수정

##### 0.3.5
 - 네이버 API 일일 허용량 초과 시 에러 코드 추가

##### 0.3.4
 - 2차 리팩토링
 - 변수의 스코프 최대한 적게 수정
 - 변수, 함수 이름 수정
 - await와 then 혼용 중지
 - any 타입 수정

##### 0.3.3
 - async & await 사용해서 코드 리팩토링
 - 사용하지 않는 코드 삭제

##### 0.3.2
 - README 수정

##### 0.3.1
 - Naver API target 오류 수정
 - 번역할 때 타이틀을 번역하기 ! -> Translate !!! 로 변경
 - README 수정

##### 0.3.0
 - Naver Papago 를 이용한 언어 감지, 언어 번역 사용
 - 영어를 번역 할 경우 한글로 번역
 - 데이터 저장 방식 변경 (언어 감지, 텍스트, 시간, 번역 결과)
 - 코드 고도화

##### 0.2.2
 - 단축키 지정 해제 (코드 데이터가 많이 들어온 것을 보아 번역기를 사용할 생각이 없는데 사용 된 것으로 보임)

##### 0.2.1
 - 단축키 지정 (Shift키 + up키)

##### 0.2.0
 - 시각화 Web 개발 완료

##### 0.1.5 ~ 0.1.7
 - 카카오 API 틀린 부분 수정
 - Time Zone 코드 오류 수정

##### 0.1.4
 - 특수문자 검색시 에러 발견 후 조치

##### 0.1.2 ~ 0.1.3
 - Error 데이터 수집 오류 수정

##### 0.1.1
 - Firebase 데이터 저장 시 Time도 저장

##### 0.1.0
- Firebase에 번역 로그 저장
- Error 로그 저장

##### 0.0.2
- 번역이 불가능할 경우 메시지 출력
- 오류상태 메시지 출력

##### 0.0.1
- 초기 버전 0.0.1



















