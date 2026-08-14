import { EntitySchema } from "typeorm";

export const AdocaoHistoricoEntity = new EntitySchema({
  name: "AdocaoHistorico",
  tableName: "adocoes_historico",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    status: {
      type: "enum",
      enum: ["ANALISE", "CONCLUIDO", "FINALIZADO", "CANCELADO", "REPROVADO"],
      nullable: false,
    },
    observacao: {
      type: "text",
      nullable: false,
    },
    adocao_id: {
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
    adocao: {
      type: "many-to-one",
      target: "Adocao",
      joinColumn: { name: "adocao_id" },
    },
  },
});