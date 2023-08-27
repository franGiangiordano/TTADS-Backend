import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/', routes);

export default app;
