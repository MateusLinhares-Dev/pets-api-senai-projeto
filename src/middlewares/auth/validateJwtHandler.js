import { UNAUTHORIZED_STATUS } from "../../constants/server.js";
import jwt from "jsonwebtoken";

export function validateJwtHandler(request, response, next) {
  const header = request.headers.authorization;

  if (!header) {
    return response.status(UNAUTHORIZED_STATUS).send({ error: "token ausente" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return response.status(UNAUTHORIZED_STATUS).send({ error: "token mal formatado" });
  }

  try {
    const conteudoDoToken = jwt.verify(token, process.env.JWT_SECRET);

    request.usuario = {
      id: conteudoDoToken.id,
      role: conteudoDoToken.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(UNAUTHORIZED_STATUS).send({ error: "token expirado" });
    }

    if (error.name === "JsonWebTokenError") {
      return response.status(UNAUTHORIZED_STATUS).send({ error: "token inválido" });
    }

    if (error.name === "NotBeforeError") {
      return response.status(UNAUTHORIZED_STATUS).send({ error: "token ainda não ativo" });
    }

    return response.status(UNAUTHORIZED_STATUS).send({ error: "falha na validação do token" });
  }
}