import { EntitySchema } from "typeorm";

export const AdocaoEntity = new EntitySchema({
  name: "Adocao",
  tableName: "adocoes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    pet_id: {
      type: "int",
      nullable: false,
    },
    lar_adotivo_id: {
      type: "int",
      nullable: false,
    },
    criado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    atualizado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    pet: {
      type: "many-to-one",
      target: "Pet",
      joinColumn: { name: "pet_id" },
    },
    lar_adotivo: {
      type: "many-to-one",
      target: "LarAdotivo",
      joinColumn: { name: "lar_adotivo_id" },
    },
    historico: {
      type: "one-to-many",
      target: "AdocaoHistorico",
      inverseSide: "adocao",
    },
  },
});