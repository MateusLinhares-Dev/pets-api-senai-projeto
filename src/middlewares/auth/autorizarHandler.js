import { FORBIDDEN_STATUS } from "../../constants/server.js";

export const autorizarHandler =
  (...rolesPermitidas) =>
  (request, response, next) => {
    const rolesMapeadas = rolesPermitidas.flat(); 

    if (!request.usuario || !rolesMapeadas.includes(request.usuario.role)) {
      return response
        .status(FORBIDDEN_STATUS)
        .send({ error: "Você não tem permissão para acessar este recurso" });
    }

    next();
  };