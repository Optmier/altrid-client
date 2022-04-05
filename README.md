This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Altrid(알트리드) 서비스 플랫폼 프론트엔드 소스
> [@Sain-Tech](https://github.com/Sain-Tech) 의 [altrid-client](https://github.com/Sain-Tech/altrid-client) 에서 추가됨.

## 실행 방법

```sh
### 프로젝트 가져오기 ###
$ git init
$ git remote add origin https://github.com/Optmier/altrid-client.git
$ git pull origin master

### src 디렉토리에 configs.zip 압축파일 내 configs 폴더 넣기

### 빌드 구성 설정 확인 ###
src/configs/configs.js 파일에 buildMode = 'dev' 확인

### 모듈 설치 및 실행 ###
$ yarn install
$ yarn start
```

## 빌드 및 업로드
### SFTP Config
```json
{
    "name": "<서버 이름>",
    "host": "<서버 IP 주소>",
    "protocol": "sftp",
    "port": 22,
    "username": "<서버 계정 이름>",
    "password": "<서버 접속 암호>",
    "context": "build/",
    "remotePath": "<업로드 할 디렉토리>",
    "uploadOnSave": false,
    "watcher": {
        "files": "**/*",
        "autoUpload": false,
        "autoDelete": false
    },
    "ignore": ["**/.vscode", "**/.git", "**/.DS_Store"]
}
```

### 빌드 구성 설정 확인
```sh
src/configs/configs.js 파일에 buildMode = 'prod' 설정 확인
```

### 빌드 및 업로드
```sh
$ yarn build
build 폴더 우클릭 후 Upload Folder
```


## 프로젝트 구조
```sh
public
    assets - 기타 파일
    bg_images - 배경 이미지
    webgazer
        webgazer.js - 시선추적 모듈
src
    _tempComponents - 임시 컴포넌트, 새로운 컴포넌트를 만들거나 임시로 실험할 때 여기서 수행하면 된다.
    AltridUI - 알트리드 서비스 전용 디자인 컴포넌트
        Accounts - 계정 원형 모양 칩 컴포넌트
        AlertnDialog - 경고 및 모달 다이얼로그
        Button - 버튼
        Checkbox - 체크박스
        Drawer - 우측에서 열리는 서랍 메뉴
            Drawer.js - 컴포넌트 메인
            DrawerActions.js - 서랍 메뉴 하단 버튼
            DrawerGroupBox.js - 서랍 메뉴 내 그룹 박스
        GroupBox - 그룹 박스
        HeaderMenu - 헤더 제목, 우측 메뉴 및 하위 내용
        Radio - 라디오 선택 버튼
        Snackbar - 하단 간편 알림 (토스트)
        Switch - 스위치 형태 체크박스
        TextField - 입력 박스 관련 컴포넌트
        ThemeColors - 컬러 스타일링 관련
            BackgroundTheme.js - 페이지 전체 배경색을 지정하고 싶을때
            ColorSets.js - 컬러 코드값 반환 모듈 (명도값, 색상 종류)
        Tooltip - 마우스 올렸을 때 툴팁
        Typography - 반응형 타이포그래피  
    components - 각 페이지별 필요한 컴포넌트
    configs - API 키, 빌드 / 실행 모드, 주소에 대한 설정 값 (깃허브 상 포함되지 않으므로 준비된 압축파일을 풀어 직접 프로젝트에 포함해야 함)
    controllers - 공통으로 쓰는 함수
    datas - 더미 데이터, 가격 정보, 플랜별 기능에 대한 설명 데이터
    images - 기타 이미지 (로고 등)
    medias - 동영상, 음악 등 미디어 데이터
    pages - 페이지 컴포넌트
        _deprecated - 폐지 예정 페이지
        _TempPages - 임시로 테스트 할 페이지
        Accounts - 마이페이지
        Admins - 관리자 페이지 (현재는 사용 안 함)
        Assignments - 과제 진행 페이지
        Classes - 클래스 페이지
        Dashboards - 대시보드 페이지
        Errors - 오류시 렌더링할 페이지
        Logins - 로그인 페이지
        MainDrafts - 과제 목록 및 만들기 페이지
        Mains - 로그인 후 메인 페이지
        PriceAndPayments - 가격 및 결제 페이지
        ZZZOthers - 기타 페이지
    redux_modules - 리덕스 설정 모듈
        alertMaker.js - 스낵바, 경고 다이얼로그 설정 및 열기
        assignmentActived.js - 과제 게시 관련
        assignmentDraft.js - 과제 만들기 관련
        classes.js - 클래스 데이터
        classList.js - 클래스 목록
        currentClass.js - 현재 클래스 정보, 실시간 강의 정보
        index.js - 리덕스 모듈 통합
        leftNavStateGlobal.js - 좌측 네비게이션 메뉴 열고 닫힌 상태
        optimerHelper.js - 옵타이머 모듈 붙이기
        params.js - 클래스 내 부 메뉴 파라미터
        planInfo.js - 현재 활성화된 플랜 정보 데이터 (기능)
        reports.js - 리포트 데이터 저장
        serverdate.js - 서버 날짜 및 시간 가져오기
        sessions.js - 로그인 세션 저장
        timer.js - 과제 수행 시 타이머 모듈
        vocaLearnings.js - 단어 학습 데이터
    styles - 스타일 설정 (현재는 styled-components 로 구현 중)
```
