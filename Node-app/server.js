import express from 'express';
// import cors from cors;

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(3000,()=>{
    console.log(`Server is running on port 3000 &{PORT}`);
});

