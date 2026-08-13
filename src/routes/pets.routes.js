import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PetEntity } from "../entidades/Pet.js";
import { verifyFieldsPets } from "../middlewares/pets/verifyFieldsPets.js";
import { CREATED_STATUS } from "../constants/server.js";

const petsRoutes = new Router();

petsRoutes.post("/pets", verifyFieldsPets, async (request, response) => {
    const petData = request.body;
    const pet = new PetEntity();
    Object.assign(pet, petData);

    try {
        const savedPet = await AppDataSource.manager.save(pet);
        response.status(CREATED_STATUS).json(savedPet);
    } catch (error) {
        response.status(500).json({ error: "Erro ao salvar o pet" });
    }
});