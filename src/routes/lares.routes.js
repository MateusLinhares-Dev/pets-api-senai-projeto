import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";
import { verifyFieldsLares } from "../middlewares/lares/verifyFieldsLares.js";
import { verifyIdExistsHandler } from "../middlewares/global/verifyIdExistsHandler.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { ROLES } from "../constants/roles.js";
import { CREATED_STATUS, OK_STATUS } from "../constants/server.js";

const laresRoutes = Router();
const larRepository = AppDataSource.getRepository(LarAdotivoEntity);

laresRoutes.post("/lares", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyFieldsLares, async (req, res) => {
  const savedLar = await larRepository.save(req.body);
  return res.status(CREATED_STATUS).json(savedLar);
});

laresRoutes.get("/lares", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), async (req, res) => {
  const { estado, tipo } = req.query;
  const filter = {};

  if (estado) filter.estado = estado;
  if (tipo) filter.tipo = tipo;

  const lares = await larRepository.find({
    where: filter,
    order: { criado_em: "ASC" },
    relations: {
      adocoes: {
        pet: true,
      }
    }
  });

  return res.status(OK_STATUS).json(lares);
});

laresRoutes.get("/lares/:id", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyIdExistsHandler(LarAdotivoEntity, "Lar Adotivo"), async (req, res) => {
  const lar = await larRepository.findOneBy({ id: parseInt(req.params.id) });
  return res.status(OK_STATUS).json(lar);
});

laresRoutes.put("/lares/:id", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyIdExistsHandler(LarAdotivoEntity, "Lar Adotivo"), verifyFieldsLares, async (req, res) => {
  await larRepository.update(req.params.id, req.body);
  const updatedLar = await larRepository.findOneBy({ id: parseInt(req.params.id) });
  return res.status(OK_STATUS).json(updatedLar);
});

export default laresRoutes;