import express from 'express';
import  cors  from 'cors';

const app = express();
const port = 4000

app.use(cors({
    origin: 'http://127.0.0.1:5173',
}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})