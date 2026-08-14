import express from "express";
import cors from "cors";

import { PORT_SERVER } from "./constants/server.js";
import { AppDataSource } from "./config/database_postgres.js";

import { captureLog } from "./middlewares/global/captureLog.js";
import { errorHandler } from "./middlewares/global/errorHandler.js";
import { validateJwtHandler } from "./middlewares/auth/validateJwtHandler.js";

import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import petsRoutes from "./routes/pets.routes.js";
import laresRoutes from "./routes/lares.routes.js";
import adocoesRoutes from "./routes/adocoes.routes.js";

const app = express();
app.use(express.json()); 
app.use(cors());

app.use(captureLog); 

app.use(publicRoutes);

app.use(validateJwtHandler); 
app.use(authRoutes);
app.use(petsRoutes);
app.use(laresRoutes);
app.use(adocoesRoutes);

app.use(errorHandler); 

try {
  await AppDataSource.initialize();
  app.listen(PORT_SERVER, () => {
    console.log("Servidor rodando");
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}