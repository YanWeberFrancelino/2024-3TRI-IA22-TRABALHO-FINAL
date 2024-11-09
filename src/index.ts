// src/index.ts
import express from 'express';
import path from 'path';
import routes from './routes';
import { connect } from './database';
import errorHandler from './middlewares/errorHandler';
import dotenv from 'dotenv';
import {
  corsOptions,
  limiter,
  securityHeaders,
  hidePoweredBy,
} from './middlewares/securityMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 4060;

app.use(express.json());

app.use(corsOptions);
app.use(limiter);
app.use(securityHeaders);
app.use(hidePoweredBy);

const publicPath = path.resolve(process.cwd(), 'public');
console.log('Servindo arquivos estáticos de:', publicPath);

app.use('/assets', express.static(path.join(publicPath, 'assets')));
//app.use(express.static(publicPath));



app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

connect()
  .then(() => {
    console.log('Banco de dados pronto.');

    app.use('/', routes);

    app.use(errorHandler);

    app.listen(port, () => console.log(`⚡ Servidor rodando na porta ${port}`));
  })
  .catch((error) => {
    console.error('Falha ao iniciar o servidor devido ao erro no banco de dados:', error);
  });
