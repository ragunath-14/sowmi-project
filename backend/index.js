import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import analyseStock from './routes/analyseStock.js';
import authRouter from './routes/auth/authRouter.js'
import adminRouter from './routes/admin/adminRouter.js'
import { startCronJobs } from './cron.js';

const app = express();
app.use(cors());
app.use(express.json());

startCronJobs();

app.use('/analyze',analyseStock);
app.use('/auth',authRouter)
app.use('/admin',adminRouter)
app.get('/test',(req,res)=>{
  res.json({message:"Reached the "})
})


const PORT = process.env.PORT || 5000;

 app.listen(PORT, '0.0.0.0', () => {
    console.log(` Backend running on port ${PORT}`);
  });
