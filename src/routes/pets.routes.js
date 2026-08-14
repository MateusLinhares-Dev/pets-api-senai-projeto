import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PetEntity } from "../entidades/Pet.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import { AdocaoHistoricoEntity } from "../entidades/AdocaoHistorico.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";
import { verifyFieldsPets } from "../middlewares/pets/verifyFieldsPets.js";
import { verifyIdExistsHandler } from "../middlewares/global/verifyIdExistsHandler.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { ROLES } from "../constants/roles.js";
import { CREATED_STATUS, OK_STATUS, BAD_REQUEST_STATUS, CONFLICT_STATUS, NO_CONTENT_STATUS } from "../constants/server.js";

const petsRoutes = Router();
const petRepository = AppDataSource.getRepository(PetEntity);
const adocaoRepository = AppDataSource.getRepository(AdocaoEntity);
const larAdotivoRepository = AppDataSource.getRepository(LarAdotivoEntity);

petsRoutes.post("/pets", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyFieldsPets, async (req, res) => {
  const savedPet = await petRepository.save(req.body);
  return res.status(CREATED_STATUS).json(savedPet);
});

petsRoutes.get("/pets", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), async (req, res) => {
  const pets = await petRepository.find({
    relations: {
      tipo: true,
      raca: true,
      cor: true,
      adocoes: {
        lar_adotivo: true,
        historico: true,
      },
    },
  });

  const petsFormatados = pets.map(pet => {
    const adocaoFinalizada = pet.adocoes.find(adocao => 
      adocao.historico.some(h => h.status === "FINALIZADO")
    );

    return {
      ...pet,
      lar_adotivo_vinculado: adocaoFinalizada ? adocaoFinalizada.lar_adotivo : null,
      adocoes: undefined, 
    };
  });

  return res.status(OK_STATUS).json(petsFormatados);
});

petsRoutes.get("/pets/:id", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyIdExistsHandler(PetEntity, "Pet"), async (req, res) => {
  const pet = await petRepository.findOne({
    where: { id: parseInt(req.params.id) },
    relations: {
      tipo: true,
      raca: true,
      cor: true
    },
  });
  return res.status(OK_STATUS).json(pet);
});

petsRoutes.put("/pets/:id", autorizarHandler([ROLES.ADMIN, ROLES.COLABORADOR]), verifyIdExistsHandler(PetEntity, "Pet"), verifyFieldsPets, async (req, res) => {
  await petRepository.update(req.params.id, req.body);
  const updatedPet = await petRepository.findOneBy({ id: parseInt(req.params.id) });
  return res.status(OK_STATUS).json(updatedPet);
});

petsRoutes.delete("/pets/:id", autorizarHandler([ROLES.ADMIN]), verifyIdExistsHandler(PetEntity, "Pet"), async (req, res) => {
  const petId = parseInt(req.params.id);

  const adocaoVinculada = await adocaoRepository.findOne({
    where: { pet_id: petId },
  });

  if (adocaoVinculada) {
    return res.status(CONFLICT_STATUS).json({ error: "Pet não pode ser deletado pois possui vínculo de adoção." });
  }

  await petRepository.softDelete(petId);
  return res.status(NO_CONTENT_STATUS).send();
});

petsRoutes.post("/pets/adotar", autorizarHandler([ROLES.ADMIN]), async (req, res) => {
  const { pet_id, lar_adotivo_id, observacao } = req.body;

  if (!pet_id || !lar_adotivo_id || !observacao) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "pet_id, lar_adotivo_id e observacao são obrigatórios." });
  }

  const petExiste = await petRepository.existsBy({ id: pet_id });
  if (!petExiste) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O pet_id informado não existe." });
  }

  const larExiste = await larAdotivoRepository.existsBy({ id: lar_adotivo_id });
  if (!larExiste) {
    return res.status(BAD_REQUEST_STATUS).json({ error: "O lar_adotivo_id informado não existe." });
  }

  const adocaoExistente = await adocaoRepository.findOne({
    where: { pet_id },
    relations: {
      historico: true
    },
  });

  if (adocaoExistente) {
    const statusAtivos = ["ANALISE", "CONCLUIDO", "FINALIZADO"];
    const possuiStatusAtivo = adocaoExistente.historico.some(h => statusAtivos.includes(h.status));

    if (possuiStatusAtivo) {
      return res.status(CONFLICT_STATUS).json({ error: "Pet já possui um processo de adoção ativo." });
    }
  }

  const novaAdocao = await AppDataSource.manager.transaction(async transactionalEntityManager => {
    const adocaoInsert = await transactionalEntityManager.insert(AdocaoEntity, {
      pet_id,
      lar_adotivo_id,
    });

    const adocaoId = adocaoInsert.identifiers[0].id;

    await transactionalEntityManager.insert(AdocaoHistoricoEntity, {
      adocao_id: adocaoId,
      status: "ANALISE",
      observacao,
    });

    return await transactionalEntityManager.findOne(AdocaoEntity, {
      where: { id: adocaoId },
      relations: { historico: true }
    });
  });

  return res.status(CREATED_STATUS).json(novaAdocao);
});

export default petsRoutes;