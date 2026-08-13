import { BAD_REQUEST_STATUS } from "../../constants/server.js";
import { PortesPets } from "../../constants/petsPorte.js";
import { SexoPets } from "../../constants/petsSexo.js";

export function verifyFieldsPets(req, res, next){
    const { nome, tipo_id, raca_id, cor_id, porte, sexo, foto_url, historia, comportamento, observacoes_extras, idade_meses } = req.body;

    if (!nome || !tipo_id || !raca_id || !cor_id || !porte) {
        return res.status(BAD_REQUEST_STATUS).json({ error: "Campos obrigatórios não preenchidos" });
    }

    if (porte && !Object.values(PortesPets).includes(porte)) {
        return res.status(BAD_REQUEST_STATUS).json({ error: "Porte inválido. Deve ser P, M ou G" });
    }

    if (sexo && !Object.values(SexoPets).includes(sexo)) {
        return res.status(BAD_REQUEST_STATUS).json({ error: "Sexo inválido. Deve ser M ou F" });
    }

    if (idade_meses && !Number.isInteger(idade_meses)) {
        return res.status(BAD_REQUEST_STATUS).json({ error: "Idade em meses deve ser um número inteiro" });
    }

    if (observacoes_extras && observacoes_extras.length > 350 || typeof observacoes_extras !== "string") {
        return res.status(BAD_REQUEST_STATUS).json({ error: "Observações extras deve ser uma string com no máximo 350 caracteres" });
    }

    next();
}