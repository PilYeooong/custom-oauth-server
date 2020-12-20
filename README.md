
# **Custom OAuth Server**

OAuth 인증의 과정 및 로직을 직접 구현해보고 이해하는데 목표가 있습니다.

## **Project Stack**

- JavaScript
- Node.js
- Express.js

## **Run on your machine**

 1. git clone https://github.com/PilYeooong/custom-oauth-server.git
 2. npm i (client / OAuth)
 3. npm start
 
## How it works

> - **OAuth 서버쪽에 계정이 존재** 하며, OAuth 서버에 OAuth 인증을 위한 **도메인 등록**을 마쳤다는 가정하에 흐름  
> - **Client**는 도메인 등록을 마치면, client_id와 client_secret을 발급  
> - **client_secret**은 노출되지 않도록 따로 분리하여 보관  

 1. Client에서 OAuth 로그인 실행시 OAuth 서버의 로그인 페이지로 리다이렉션 및 이동
 2. 기존 OAuth 계정으로 로그인
 3. OAuth 서버로부터 authorization_code를 받고, Client 페이지로 리다이렉션
 4. Client 페이지에서는 받아온 authorization_code, client_id, client_secret와 함께 토큰 요청 및 토큰을 받아 저장
 5. Client는 받아온 토큰을 기반으로, OAuth 서버로 유저 정보를 요청
 6. OAuth 서버는 토큰을 검증하고, 요청한 정보를 응답
 7. Client는 받아온 OAuth 서버로부터 받아 온 유저 정보로 로그인 실행 및 완료
    (Client 서버에 존재하지 않는 유저일 시 유저를 생성)  

## **Contact**
pilyeooong@gmail.com



