



## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password    //this is the forgot password,--It will take teh existing password and the new password , it will check whether the is logged in , use the bcrypt.compare  to check the existing password correct or not , and check new password is strong enough or not 
- 

## connectionRequestRouter
- POST /request/send/interest/:userId
- POST/request/send/ignored/:userId
- POST /request/review/accespted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of other users on platform


Status: ignore , interestes, accepetd , rejected.