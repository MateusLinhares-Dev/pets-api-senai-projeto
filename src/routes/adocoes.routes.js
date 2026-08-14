import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { AdocaoHistoricoEntity } from "../entidades/AdocaoHistorico.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { ROLES } from "../constants/roles.js";
import { CREATED_STATUS, BAD_REQUEST_STATUS } from "../constants/server.js";

const adocoesRoutes = Router();
const historicoRepository = AppDataSource.getRepository(AdocaoHistoricoEntity);
const adocaoRepository = AppDataSource.getRepository(AdocaoEntity);

adocoesRoutes.put("/atualizar_status_adocao", autorizarHandler([ROLES.ADMIN]), async (req, res) => {
  const { adocao_id, status, observacao } = req.body;
  const statusValidos = ["ANALISE", "CONCLUIDO", "FINALIZADO", "CANCELADO", "REPROVADO"];

  if (!adocao_id || !status || !observacao) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "adocao_id, status e observacao são obrigatórios." });
  }

  if (!statusValidos.includes(status)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "Status inválido fornecido." });
  }

  const adocaoExiste = await adocaoRepository.existsBy({ id: adocao_id });
  if (!adocaoExiste) {
    return res.status(404).json({ error: "A adoção informada não foi encontrada." });
  }

  const novoHistorico = await historicoRepository.save({
    adocao_id,
    status,
    observacao,
  });

  return res.status(CREATED_STATUS).json(novoHistorico);
});

export default adocoesRoutes;