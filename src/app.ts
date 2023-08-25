import express from 'express';
import path from 'path';
import routes from './routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/', routes);

export default app;
