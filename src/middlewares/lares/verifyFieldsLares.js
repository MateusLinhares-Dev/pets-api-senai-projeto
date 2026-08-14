import { BAD_REQUEST_STATUS } from "../../constants/server.js";

export const verifyFieldsLares = (req, res, next) => {
  const { nome, cep, estado, cidade, bairro, rua, possui_telas_protecao, tipo, telefone } = req.body;

  if (!nome || !cep || !estado || !cidade || !bairro || !rua || possui_telas_protecao === undefined || !tipo || !telefone) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  const cepRegex = /^\d{5}-\d{3}$/;
  if (!cepRegex.test(cep)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O CEP deve estar no formato xxxxx-xxx." });
  }

  const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O telefone deve estar no formato (xx) xxxxx-xxxx." });
  }

  if (typeof possui_telas_protecao !== "boolean") {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O campo possui_telas_protecao deve ser booleano." });
  }

  if (!["TEMPORARIO", "DEFINITIVO"].includes(tipo)) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O tipo deve ser TEMPORARIO ou DEFINITIVO." });
  }

  next();
};