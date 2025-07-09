



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
- 
* this comes in the receiving side[the logic for both the api is almost same.](we can make the status dynamis ,whether it is accepted or rejected.)---one api will two of the job.
=================================
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


## connectionRequestRouter
- POST /request/send/:status/:userId   [for interested or ignored.]
- POST /request/review/:status/:requestId  [for accepted or rejected]

## userRouter
GET /user/requests/received
- GET /user/connections---THIS API WILL GIVES ALL THE CONNECTION OF THE USER
- GET /user/requests----THIS API WILL GIVES ALL THE REQUEST OF THE USER
- GET /user/feed - Gets you the profile of other users on platform


Status: ignore , interestes, accepetd , rejected.