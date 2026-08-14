import { AppDataSource } from "../../config/database_postgres.js";
import { TipoEntity } from "../../entidades/Tipo.js";
import { RacaEntity } from "../../entidades/Raca.js";
import { CorEntity } from "../../entidades/Cor.js";
import { BAD_REQUEST_STATUS } from "../../constants/server.js";

export const verifyFieldsPets = async (req, res, next) => {
  const { nome, tipo_id, raca_id, cor_id, porte, sexo } = req.body;

  if (!nome || !tipo_id || !raca_id || !cor_id || !porte) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "Campos obrigatórios ausentes." });
  }

  if (!["P", "M", "G"].includes(porte)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O porte deve ser P, M ou G." });
  }

  if (sexo && !["M", "F"].includes(sexo)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O sexo deve ser M ou F." });
  }

  const tipoRepo = AppDataSource.getRepository(TipoEntity);
  const racaRepo = AppDataSource.getRepository(RacaEntity);
  const corRepo = AppDataSource.getRepository(CorEntity);

  const [tipoExiste, racaExiste, corExiste] = await Promise.all([
    tipoRepo.existsBy({ id: tipo_id }),
    racaRepo.existsBy({ id: raca_id }),
    corRepo.existsBy({ id: cor_id }),
  ]);

  if (!tipoExiste || !racaExiste || !corExiste) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "Tipo, raça ou cor informados são inválidos." });
  }

  next();
};