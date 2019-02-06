# 한 -> 영 번역기

변수, 함수, 클래스 이름이 영어로 생각 안날때 편하게 번역해주는 플러그인입니다.

Firebase Database 와 연동이 되었으며, 번역한 영어 데이터를 수집 중 입니다.

다음 릴리즈 때 시각화한 홈페이지를 보여드리겠습니다.

**Git Star 는 개발자에게 힘이됩니다 !!**

## Features

바로 번역하기 누르는 순간

![translate](/asset/translate.png)

짜잔 하고 번역합니다.

![translate](/asset/translate_1.png)

Kakao API 를 이용해 만들었으며
일일허용량 5만 단어 입니다.

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

## 수정 사항

##### 0.0.1

- 초기 버전 0.0.1

##### 0.0.2

- 번역이 불가능할 경우 메시지 출력
- 오류상태 메시지 출력

##### 20190207_1

- Firebase에 번역 로그 저장
- Error 로그 저장