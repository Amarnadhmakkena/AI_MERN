const express=require('express');const cors=require('cors');const mongoose=require('mongoose');require('dotenv').config();
const auth=require('./routes/auth');const resume=require('./routes/resume');const jobs=require('./routes/jobs');
const app=express();app.use(cors());app.use(express.json());mongoose.connect(process.env.MONGO_URI);
app.use('/auth',auth);app.use('/resume',resume);app.use('/jobs',jobs);
app.listen(process.env.PORT||5000,()=>console.log('backend running'));
