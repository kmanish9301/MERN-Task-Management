import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './src/configs/db.js';
import TaskRoute from './src/routes/TaskRoute.js';
import UserRoute from './src/routes/UserRoute.js';
import AuthRoute from './src/routes/AuthRoute.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/v1', TaskRoute);
app.use('/v1', UserRoute);
app.use('/auth', AuthRoute);

connectDB(app);