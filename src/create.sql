DROP TABLE IF EXISTS public."Produto" CASCADE;
DROP TABLE IF EXISTS public."Loja" CASCADE;
DROP TABLE IF EXISTS public."Marketplace" CASCADE;
DROP TABLE IF EXISTS public."Empresa" CASCADE;
DROP TABLE IF EXISTS public."Cliente" CASCADE;
DROP TABLE IF EXISTS public."Pessoa" CASCADE;
DROP TYPE IF EXISTS public."Sexo" CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE public."Sexo" AS ENUM ('MASCULINO', 'FEMININO');
CREATE TYPE public."TipoMarketplace" AS ENUM ('OPENCART');

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
CREATE TABLE public."Empresa" (
  "id" TEXT NOT NULL,
  "razaoSocial" TEXT NOT NULL,
  "cnae" TEXT,
  "inscricaoMunicipal" TEXT,
  "inscricaoEstadual" TEXT,
  "certificadoDigital" TEXT,
  "logo" TEXT,
  "nivelRepasse" INTEGER NOT NULL,
  "conviteValor" INTEGER NOT NULL,
  "pessoaId" TEXT NOT NULL,

  CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Marketplace" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "apiUrl" TEXT,
  "tipo" public."TipoMarketplace" NOT NULL,

  CONSTRAINT "Marketplace_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Loja" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "chaveAcesso" TEXT NOT NULL,
  "senha" TEXT NOT NULL,
  "url" TEXT,
  "empresaId" TEXT NOT NULL,
  "status" BOOLEAN NOT NULL DEFAULT true,
  "marketplaceId" TEXT NOT NULL,

  CONSTRAINT "Loja_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Produto" (
  "sku" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "valor" DOUBLE PRECISION NOT NULL,
  "lojaId" TEXT,

  CONSTRAINT "Produto_pkey" PRIMARY KEY ("sku")
);

CREATE UNIQUE INDEX "Pessoa_cpfCnpj_key" ON public."Pessoa"("cpfCnpj");
CREATE UNIQUE INDEX "Pessoa_email_key" ON public."Pessoa"("email");
CREATE UNIQUE INDEX "Pessoa_instagram_key" ON public."Pessoa"("instagram");
CREATE UNIQUE INDEX "Empresa_pessoaId_key" ON public."Empresa"("pessoaId");
CREATE UNIQUE INDEX "Loja_nome_empresaId_key" ON public."Loja"("nome", "empresaId");
CREATE UNIQUE INDEX "Marketplace_nome_key" ON public."Marketplace"("nome");
CREATE UNIQUE INDEX "Marketplace_tipo_key" ON public."Marketplace"("tipo");

ALTER TABLE public."Empresa" ADD CONSTRAINT "Empresa_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Loja" ADD CONSTRAINT "Loja_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Loja" ADD CONSTRAINT "Loja_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES public."Marketplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Produto" ADD CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES public."Loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO public."Marketplace"
(id, nome, "apiUrl", tipo)
VALUES('9184beee-cde8-4eed-b516-65035f99b567', 'OpenCart', 'https://docs.opencart.com/', 'OPENCART'::public."TipoMarketplace");

INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('5f3c509b-9cdb-4d7f-a2bc-29c703183fab', '32053578000100', 'BRK LOG', 'diego@mendesrocha.me', 'newhairoficial', NULL, NULL, '2016-03-10 16:17:16.000', '2022-12-12 20:36:04.000');

INSERT INTO public."Empresa"
(id, "razaoSocial", cnae, "inscricaoMunicipal", "inscricaoEstadual", "certificadoDigital", logo, "nivelRepasse", "conviteValor", "pessoaId")
VALUES('c975f02c-cee8-4630-9fa8-239cc590dfe1', 'BRK LOGISTICA E DISTRIBUICAO EIRELI', NULL, NULL, '107446154', NULL, NULL, 1, 180, '5f3c509b-9cdb-4d7f-a2bc-29c703183fab');

INSERT INTO public."Loja"
(id, nome, "chaveAcesso", senha, url, "empresaId", status, "marketplaceId")
VALUES('2f01c15a-e882-44ac-aedf-5f2754f24404', 'Loja New Hair', 'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT', 'Senha2321', 'https://loja.newhairoficial.com.br', 'c975f02c-cee8-4630-9fa8-239cc590dfe1', true, '9184beee-cde8-4eed-b516-65035f99b567');

