DROP TABLE IF EXISTS public."Cliente" CASCADE;
DROP TABLE IF EXISTS public."Pessoa" CASCADE;
DROP TYPE IF EXISTS public."Sexo" CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE public."Sexo" AS ENUM ('MASCULINO', 'FEMININO');

CREATE TABLE public."Pessoa" (
  "id" TEXT NOT NULL,
  "cpfCnpj" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "instagram" TEXT,
  "sexo" public."Sexo",
  "dataNascimento" TIMESTAMP(3),
  "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dataAlteracao" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Cliente" (
  "id" TEXT NOT NULL,
  "marketing" BOOLEAN NOT NULL DEFAULT true,
  "pessoaId" TEXT NOT NULL,

  CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);