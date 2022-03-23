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
$ yarn run dev
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

```
