const express = require('express')
const cors = require ('cors')
const passport = require('passport');
const { db } = require('./config/connection');


require('dotenv').config();
require('./config/passportUser')(passport);
require('./config/passportAdmin')(passport)
require('./config/passportDoctor')(passport)
const UserRouter =require('./Router/UserRouter')
const AdminRouter= require('./Router/AdminRouter')
const DoctorRouter= require('./Router/DoctorRouter')
const AppointmentRouter= require('./Router/AppointmentRouter')

const app=express()
const port=process.env.PORT || 4000
db()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT", "PATCH", "DELETE"]         
}))         


app.use(express.json())
app.use(passport.initialize());

app.use("/api/user", UserRouter)
app.use("/api/admin", AdminRouter)
app.use("/api/doctor", DoctorRouter)
app.use("/api/appoint", AppointmentRouter)

app.get("/",(req,res)=>{
   res.send("my server is working properly.....")
})

app.listen(port,()=>{
    console.log("server started at port : port",port)
})