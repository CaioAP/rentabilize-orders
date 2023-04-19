DROP TABLE IF EXISTS public."PagamentoTipo" CASCADE;
DROP TABLE IF EXISTS public."StatusPedido" CASCADE;
DROP TABLE IF EXISTS public."StatusPedidoMapa" CASCADE;
DROP TABLE IF EXISTS public."PedidoItem" CASCADE;
DROP TABLE IF EXISTS public."ProdutoComissao" CASCADE;
DROP TABLE IF EXISTS public."Saldo" CASCADE;
DROP TABLE IF EXISTS public."Financeiro" CASCADE;
DROP TABLE IF EXISTS public."CupomLoja" CASCADE;
DROP TABLE IF EXISTS public."Cupom" CASCADE;
DROP TABLE IF EXISTS public."Convite" CASCADE;
DROP TABLE IF EXISTS public."ConviteSaldo" CASCADE;
DROP TABLE IF EXISTS public."Produto" CASCADE;
DROP TABLE IF EXISTS public."Loja" CASCADE;
DROP TABLE IF EXISTS public."MarketplaceStatus" CASCADE;
DROP TABLE IF EXISTS public."Marketplace" CASCADE;
DROP TABLE IF EXISTS public."InfluenciadorPorEmpresa" CASCADE;
DROP TABLE IF EXISTS public."Influenciador" CASCADE;
DROP TABLE IF EXISTS public."UsuarioEmpresa" CASCADE;
DROP TABLE IF EXISTS public."Usuario" CASCADE;
DROP TABLE IF EXISTS public."EmpresaComissao" CASCADE;
DROP TABLE IF EXISTS public."Empresa" CASCADE;
DROP TABLE IF EXISTS public."Cliente" CASCADE;
DROP TABLE IF EXISTS public."Contato" CASCADE;
DROP TABLE IF EXISTS public."Endereco" CASCADE;
DROP TABLE IF EXISTS public."Pessoa" CASCADE;
DROP TYPE IF EXISTS public."TipoMarketplace" CASCADE;
DROP TYPE IF EXISTS public."TipoFinanceiro" CASCADE;
DROP TYPE IF EXISTS public."Qualificado" CASCADE;
DROP TYPE IF EXISTS public."Sexo" CASCADE;
DROP TYPE IF EXISTS public."Role" CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPRESA', 'INFLUENCIADOR');
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO');
CREATE TYPE "Qualificado" AS ENUM ('AGUARDANDO', 'APROVADO', 'REPROVADO');
CREATE TYPE "TipoFinanceiro" AS ENUM ('CREDITO', 'DEBITO');
CREATE TYPE "TipoMarketplace" AS ENUM ('OPENCART');

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
CREATE TABLE public."Contato" (
    "id" TEXT NOT NULL,
    "nome" TEXT DEFAULT '',
    "contato" TEXT NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT false,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Endereco" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" BIGINT NOT NULL DEFAULT 0,
    "logradouro" TEXT NOT NULL,
    "complemento" TEXT,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Usuario" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "acesso" public."Role" NOT NULL DEFAULT 'INFLUENCIADOR',
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."UsuarioEmpresa" (
    "usuarioId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY ("usuarioId","empresaId")
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
CREATE TABLE public."EmpresaComissao" (
    "id" TEXT NOT NULL,
    "comissao" DOUBLE PRECISION NOT NULL,
    "nivel" INTEGER NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "EmpresaComissao_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."ConviteSaldo" (
    "id" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "influenciadorId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "ConviteSaldo_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Convite" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "influenciadorId" TEXT,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Convite_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Influenciador" (
    "id" TEXT NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "atualizado" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Influenciador_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."InfluenciadorPorEmpresa" (
    "id" TEXT NOT NULL,
    "qualificado" public."Qualificado" NOT NULL DEFAULT 'AGUARDANDO',
    "empresaId" TEXT NOT NULL,
    "convidadoId" TEXT NOT NULL,
    "convidanteId" TEXT,

    CONSTRAINT "InfluenciadorPorEmpresa_pkey" PRIMARY KEY ("id")
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
CREATE TABLE public."Marketplace" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apiUrl" TEXT,
    "tipo" public."TipoMarketplace" NOT NULL,

    CONSTRAINT "Marketplace_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."MarketplaceStatus" (
    "id" TEXT NOT NULL,
    "idExt" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "marketplaceId" TEXT NOT NULL,

    CONSTRAINT "MarketplaceStatus_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Cupom" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "desconto" INTEGER,
    "observacao" TEXT,
    "descricao" TEXT,
    "motivo" TEXT,
    "validade" TIMESTAMP(3),
    "dataAprovacao" TIMESTAMP(3),
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "influenciadorId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."CupomLoja" (
    "cupomId" TEXT NOT NULL,
    "lojaId" TEXT NOT NULL,
    "desconto" INTEGER NOT NULL,

    CONSTRAINT "CupomLoja_pkey" PRIMARY KEY ("cupomId","lojaId")
);
CREATE TABLE public."Cliente" (
    "id" TEXT NOT NULL,
    "marketing" BOOLEAN NOT NULL DEFAULT true,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Pedido" (
    "id" TEXT NOT NULL,
    "idExt" TEXT NOT NULL,
    "valor" DOUBLE PRECISION,
    "descontos" DOUBLE PRECISION,
    "dataPedido" TIMESTAMP(3) NOT NULL,
    "dataAlteracao" TIMESTAMP(3),
    "observacao" TEXT,
    "statusPedidoId" TEXT NOT NULL,
    "pagamentoTipoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cupomId" TEXT,
    "lojaId" TEXT NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."PagamentoTipo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "PagamentoTipo_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."StatusPedido" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusPedido_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."StatusPedidoMapa" (
    "statusPedidoId" TEXT NOT NULL,
    "marketPlaceStatusId" TEXT NOT NULL,

    CONSTRAINT "StatusPedidoMapa_pkey" PRIMARY KEY ("statusPedidoId","marketPlaceStatusId")
);
CREATE TABLE public."PedidoItem" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "ncm" INTEGER NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION,
    "descontos" DOUBLE PRECISION,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Produto" (
    "sku" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "lojaId" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("sku")
);
CREATE TABLE public."ProdutoComissao" (
    "comissao" INTEGER NOT NULL,
    "repasse" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,

    CONSTRAINT "ProdutoComissao_pkey" PRIMARY KEY ("sku")
);
CREATE TABLE public."Saldo" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "disponivel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "empresaId" TEXT NOT NULL,
    "influenciadorId" TEXT NOT NULL,

    CONSTRAINT "Saldo_pkey" PRIMARY KEY ("id")
);
CREATE TABLE public."Financeiro" (
    "id" TEXT NOT NULL,
    "comissao" DOUBLE PRECISION,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" public."TipoFinanceiro" NOT NULL,
    "pedidoId" TEXT,
    "influenciadorId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Pessoa_cpfCnpj_key" ON public."Pessoa"("cpfCnpj");
CREATE UNIQUE INDEX "Pessoa_email_key" ON public."Pessoa"("email");
CREATE UNIQUE INDEX "Pessoa_instagram_key" ON public."Pessoa"("instagram");
CREATE UNIQUE INDEX "Usuario_usuario_key" ON public."Usuario"("usuario");
CREATE UNIQUE INDEX "Usuario_pessoaId_key" ON public."Usuario"("pessoaId");
CREATE UNIQUE INDEX "Empresa_pessoaId_key" ON public."Empresa"("pessoaId");
CREATE UNIQUE INDEX "EmpresaComissao_empresaId_nivel_key" ON public."EmpresaComissao"("empresaId", "nivel");
CREATE UNIQUE INDEX "ConviteSaldo_influenciadorId_empresaId_key" ON public."ConviteSaldo"("influenciadorId", "empresaId");
CREATE UNIQUE INDEX "Influenciador_usuarioId_key" ON public."Influenciador"("usuarioId");
CREATE UNIQUE INDEX "InfluenciadorPorEmpresa_empresaId_convidadoId_key" ON public."InfluenciadorPorEmpresa"("empresaId", "convidadoId");
CREATE UNIQUE INDEX "Loja_nome_empresaId_key" ON public."Loja"("nome", "empresaId");
CREATE UNIQUE INDEX "Marketplace_nome_key" ON public."Marketplace"("nome");
CREATE UNIQUE INDEX "Marketplace_tipo_key" ON public."Marketplace"("tipo");
CREATE UNIQUE INDEX "MarketplaceStatus_nome_key" ON public."MarketplaceStatus"("nome");
CREATE UNIQUE INDEX "Cupom_nome_empresaId_key" ON public."Cupom"("nome", "empresaId");
CREATE UNIQUE INDEX "Pedido_idExt_lojaId_key" ON public."Pedido"("idExt", "lojaId");
CREATE UNIQUE INDEX "PagamentoTipo_nome_key" ON public."PagamentoTipo"("nome");
CREATE UNIQUE INDEX "StatusPedido_nome_key" ON public."StatusPedido"("nome");
CREATE UNIQUE INDEX "PedidoItem_pedidoId_produtoId_key" ON public."PedidoItem"("pedidoId", "produtoId");
CREATE UNIQUE INDEX "ProdutoComissao_sku_key" ON public."ProdutoComissao"("sku");
CREATE UNIQUE INDEX "Saldo_empresaId_influenciadorId_key" ON public."Saldo"("empresaId", "influenciadorId");
CREATE UNIQUE INDEX "Cliente_pessoaId_key" ON public."Cliente"("pessoaId");

ALTER TABLE public."Contato" ADD CONSTRAINT "Contato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Endereco" ADD CONSTRAINT "Endereco_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Usuario" ADD CONSTRAINT "Usuario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Empresa" ADD CONSTRAINT "Empresa_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."EmpresaComissao" ADD CONSTRAINT "EmpresaComissao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."ConviteSaldo" ADD CONSTRAINT "ConviteSaldo_influenciadorId_fkey" FOREIGN KEY ("influenciadorId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."ConviteSaldo" ADD CONSTRAINT "ConviteSaldo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Convite" ADD CONSTRAINT "Convite_influenciadorId_fkey" FOREIGN KEY ("influenciadorId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Convite" ADD CONSTRAINT "Convite_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Influenciador" ADD CONSTRAINT "Influenciador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."InfluenciadorPorEmpresa" ADD CONSTRAINT "InfluenciadorPorEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."InfluenciadorPorEmpresa" ADD CONSTRAINT "InfluenciadorPorEmpresa_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."InfluenciadorPorEmpresa" ADD CONSTRAINT "InfluenciadorPorEmpresa_convidanteId_fkey" FOREIGN KEY ("convidanteId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Loja" ADD CONSTRAINT "Loja_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Loja" ADD CONSTRAINT "Loja_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES public."Marketplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."MarketplaceStatus" ADD CONSTRAINT "MarketplaceStatus_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES public."Marketplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Cupom" ADD CONSTRAINT "Cupom_influenciadorId_fkey" FOREIGN KEY ("influenciadorId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Cupom" ADD CONSTRAINT "Cupom_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Cupom" ADD CONSTRAINT "Cupom_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."CupomLoja" ADD CONSTRAINT "CupomLoja_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES public."Cupom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."CupomLoja" ADD CONSTRAINT "CupomLoja_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES public."Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Cliente" ADD CONSTRAINT "Cliente_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES public."Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Pedido" ADD CONSTRAINT "Pedido_statusPedidoId_fkey" FOREIGN KEY ("statusPedidoId") REFERENCES public."StatusPedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."Pedido" ADD CONSTRAINT "Pedido_pagamentoTipoId_fkey" FOREIGN KEY ("pagamentoTipoId") REFERENCES public."PagamentoTipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public."Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Pedido" ADD CONSTRAINT "Pedido_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES public."Cupom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE public."Pedido" ADD CONSTRAINT "Pedido_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES public."Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."StatusPedidoMapa" ADD CONSTRAINT "StatusPedidoMapa_statusPedidoId_fkey" FOREIGN KEY ("statusPedidoId") REFERENCES public."StatusPedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."StatusPedidoMapa" ADD CONSTRAINT "StatusPedidoMapa_marketPlaceStatusId_fkey" FOREIGN KEY ("marketPlaceStatusId") REFERENCES public."MarketplaceStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."PedidoItem" ADD CONSTRAINT "PedidoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES public."Produto"("sku") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Produto" ADD CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES public."Loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE public."ProdutoComissao" ADD CONSTRAINT "ProdutoComissao_sku_fkey" FOREIGN KEY ("sku") REFERENCES public."Produto"("sku") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Saldo" ADD CONSTRAINT "Saldo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Saldo" ADD CONSTRAINT "Saldo_influenciadorId_fkey" FOREIGN KEY ("influenciadorId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Financeiro" ADD CONSTRAINT "Financeiro_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Financeiro" ADD CONSTRAINT "Financeiro_influenciadorId_fkey" FOREIGN KEY ("influenciadorId") REFERENCES public."Influenciador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."Financeiro" ADD CONSTRAINT "Financeiro_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES public."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."Financeiro" ADD CONSTRAINT "Financeiro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO public."Marketplace"
(id, nome, "apiUrl", tipo)
VALUES('9184beee-cde8-4eed-b516-65035f99b567', 'OpenCart', 'https://docs.opencart.com/', 'OPENCART'::public."TipoMarketplace");

INSERT INTO public."StatusPedido"
(id, nome)
VALUES('ae5afd6a-6850-4ec2-9466-964dcc3ec7be', 'Aguardando pagamento');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('35be9020-e170-45c6-a9f4-e957ca373bfc', 'Aprovado');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('eea65241-334c-4dba-ab96-ba6ae386254e', 'Em separação');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('17f48120-1ce4-4416-a5f4-301e6a7ad910', 'Enviado');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('4fc5a7dd-5d68-478b-aa1d-4f7b3ca96abb', 'Entregue');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', 'Cancelado');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('47ca937c-1e52-4f2f-a89e-5b2f77d1b8e7', 'Negado');
INSERT INTO public."StatusPedido"
(id, nome)
VALUES('317bf015-1c58-454e-9d6c-a518fdeb6682', 'Estornado');

INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('933b2cad-b3d3-44dc-8265-5c53700efe62', '1', 'Aguardando pagamento', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('baff41bc-08c6-4f35-b1bd-b4b8da143219', '2', 'Processando', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('b2fa288f-ea9a-4361-8805-1ebdca7f3870', '3', 'Pagamento aprovado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('4cd4ce2e-3e26-4fe3-a618-ead3af0da542', '4', 'Em produção', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('a58915c6-ecde-43be-ae72-b2fe5e5188cd', '5', 'Em separação', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('f2faa810-6a67-4ea9-a86b-1aed50814651', '6', 'Embalando', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('2021d177-eb08-4a10-9312-6e28902fdd42', '7', 'Enviado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('efde8adf-e2ad-454f-9be8-99fc01bf1d9a', '8', 'Entregue', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('56bbbe53-6ea7-4590-a2b7-78403a3eb9d2', '9', 'Cancelado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('3786ca17-8e39-4f7b-a57e-ad66b7c5cb56', '10', 'Negado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('c2239617-0502-4faf-8e90-eb6f4be9accb', '11', 'Anulado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('9fe212ed-84bd-454c-a4e2-c9221e13252f', '12', 'Expirado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('53e1fba2-13c1-42dd-bbe7-f48f95d4bf82', '13', 'Falhou', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('26383fc3-4e11-40b4-aef2-c145be443dad', '14', 'Reembolsado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('4ed604d2-09e5-4c00-a737-57b523ac6ae9', '15', 'Estornado', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('606aa8b0-1a23-4cfb-b770-918e29e6f7a8', '16', 'Chargeback', '9184beee-cde8-4eed-b516-65035f99b567');
INSERT INTO public."MarketplaceStatus"
(id, "idExt", nome, "marketplaceId")
VALUES('c8ce6bd1-396a-4e5d-b52a-c2dbfdd18a4b', '17', 'Chargeback cancelado', '9184beee-cde8-4eed-b516-65035f99b567');

INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('ae5afd6a-6850-4ec2-9466-964dcc3ec7be', '933b2cad-b3d3-44dc-8265-5c53700efe62');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('35be9020-e170-45c6-a9f4-e957ca373bfc', 'b2fa288f-ea9a-4361-8805-1ebdca7f3870');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('17f48120-1ce4-4416-a5f4-301e6a7ad910', '2021d177-eb08-4a10-9312-6e28902fdd42');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('4fc5a7dd-5d68-478b-aa1d-4f7b3ca96abb', 'efde8adf-e2ad-454f-9be8-99fc01bf1d9a');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('eea65241-334c-4dba-ab96-ba6ae386254e', '4cd4ce2e-3e26-4fe3-a618-ead3af0da542');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', '56bbbe53-6ea7-4590-a2b7-78403a3eb9d2');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('ae5afd6a-6850-4ec2-9466-964dcc3ec7be', 'baff41bc-08c6-4f35-b1bd-b4b8da143219');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('eea65241-334c-4dba-ab96-ba6ae386254e', 'a58915c6-ecde-43be-ae72-b2fe5e5188cd');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', 'c2239617-0502-4faf-8e90-eb6f4be9accb');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('eea65241-334c-4dba-ab96-ba6ae386254e', 'f2faa810-6a67-4ea9-a86b-1aed50814651');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', '9fe212ed-84bd-454c-a4e2-c9221e13252f');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', '53e1fba2-13c1-42dd-bbe7-f48f95d4bf82');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', '606aa8b0-1a23-4cfb-b770-918e29e6f7a8');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('47ca937c-1e52-4f2f-a89e-5b2f77d1b8e7', '3786ca17-8e39-4f7b-a57e-ad66b7c5cb56');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('91eaec1a-c78c-44a1-9cae-38be071033de', 'c8ce6bd1-396a-4e5d-b52a-c2dbfdd18a4b');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('317bf015-1c58-454e-9d6c-a518fdeb6682', '26383fc3-4e11-40b4-aef2-c145be443dad');
INSERT INTO public."StatusPedidoMapa"
("statusPedidoId", "marketPlaceStatusId")
VALUES('317bf015-1c58-454e-9d6c-a518fdeb6682', '4ed604d2-09e5-4c00-a737-57b523ac6ae9');

INSERT INTO public."PagamentoTipo"
(id, nome)
VALUES('24d069ae-fd0c-4aa6-9523-b7fc2fd4d675', 'PIX');
INSERT INTO public."PagamentoTipo"
(id, nome)
VALUES('5bcbcd07-e8b7-4f1f-a05a-aacb03566640', 'Boleto');
INSERT INTO public."PagamentoTipo"
(id, nome)
VALUES('89e78447-a0bc-4920-ad4d-f10dac154543', 'Cartão de crédito');
INSERT INTO public."PagamentoTipo"
(id, nome)
VALUES('a0510108-fac7-42f5-a0e9-df07e303832c', 'Cartão de débito');

INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('5f3c509b-9cdb-4d7f-a2bc-29c703183fab', '32053578000100', 'BRK LOG', 'diego@mendesrocha.me', 'newhairoficial', NULL, NULL, '2016-03-10 16:17:16.000', '2022-12-12 20:36:04.000');
INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('c5e795fb-9b98-49b4-80de-f4338fff5ebd', '11943195641', 'LETICIA LIRA', 'leticia_lira_1@hotmail.com', 'rapunzelemfoco', NULL, '1995-06-02 00:00:00.000', '2021-02-01 00:00:00.000', '2022-12-15 13:11:26.000');
INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('113904f9-b698-4ce6-b317-beacb9b7a684', '02190889189', 'LARISSA COSTA', 'larissacostaesteticista@gmail.com', 'larissacostabs', NULL, '1997-08-25 00:00:00.000', '2021-02-01 00:00:00.000', '2022-12-15 13:11:31.000');
INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('070e04ba-672c-418f-9d9c-2e9a583081d3', '36704979867', 'Edna Aparecida  Costa', 'edna290509@gmail.com', NULL, 'MASCULINO'::public."Sexo", '1991-09-04 03:00:00.000', '2023-04-07 11:40:00.923', '2023-04-07 11:40:00.923');

INSERT INTO public."Empresa"
(id, "razaoSocial", cnae, "inscricaoMunicipal", "inscricaoEstadual", "certificadoDigital", logo, "nivelRepasse", "conviteValor", "pessoaId")
VALUES('c975f02c-cee8-4630-9fa8-239cc590dfe1', 'BRK LOGISTICA E DISTRIBUICAO EIRELI', NULL, NULL, '107446154', NULL, NULL, 1, 180, '5f3c509b-9cdb-4d7f-a2bc-29c703183fab');

INSERT INTO public."EmpresaComissao"
(id, comissao, nivel, "empresaId")
VALUES('c8fbd6e0-9400-4900-b485-d6305ce1518d', 8.0, 1, 'c975f02c-cee8-4630-9fa8-239cc590dfe1');
INSERT INTO public."EmpresaComissao"
(id, comissao, nivel, "empresaId")
VALUES('dba2dfdd-111e-43fb-b2d9-28446bdba186', 2.0, 2, 'c975f02c-cee8-4630-9fa8-239cc590dfe1');

INSERT INTO public."Loja"
(id, nome, "chaveAcesso", senha, url, "empresaId", status, "marketplaceId")
VALUES('2f01c15a-e882-44ac-aedf-5f2754f24404', 'Loja New Hair', 'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT', 'Senha2321', 'https://loja.newhairoficial.com.br', 'c975f02c-cee8-4630-9fa8-239cc590dfe1', true, '9184beee-cde8-4eed-b516-65035f99b567');

INSERT INTO public."Usuario"
(id, usuario, senha, foto, acesso, "pessoaId")
VALUES('b63553d1-3001-4078-94e5-aca0e9248157', 'lira', '$argon2id$v=19$m=4096,t=3,p=1$gTTTDUQ/8S4a+0FM3tg2hw$976GWLIpscij5LKfwS1v1wA/7UhBpUIqTDT52n21CCg', NULL, 'INFLUENCIADOR'::public."Role", 'c5e795fb-9b98-49b4-80de-f4338fff5ebd');
INSERT INTO public."Usuario"
(id, usuario, senha, foto, acesso, "pessoaId")
VALUES('427719ec-8bc2-457e-81a5-0267abe1d36d', 'larissa', '$argon2id$v=19$m=4096,t=3,p=1$lumGT16LJnr/Rx9+uPZ1Pw$FH0bpHCm9GTq32D4nAKEBi5PmMj+pL2vODjCpPdmFpc', NULL, 'INFLUENCIADOR'::public."Role", '113904f9-b698-4ce6-b317-beacb9b7a684');

INSERT INTO public."Influenciador"
(id, verificado, atualizado, "usuarioId")
VALUES('9ce732da-34a9-4adb-89c1-557693638420', true, true, 'b63553d1-3001-4078-94e5-aca0e9248157');
INSERT INTO public."Influenciador"
(id, verificado, atualizado, "usuarioId")
VALUES('150c98aa-4ea1-4329-91e1-fb5ff1b6701e', true, true, '427719ec-8bc2-457e-81a5-0267abe1d36d');

INSERT INTO public."InfluenciadorPorEmpresa"
(id, "qualificado", "empresaId", "convidadoId", "convidanteId")
VALUES('2d5f62ed-c62d-4930-b6ae-ca04a6924003', 'APROVADO'::public."Qualificado", 'c975f02c-cee8-4630-9fa8-239cc590dfe1', '150c98aa-4ea1-4329-91e1-fb5ff1b6701e', '9ce732da-34a9-4adb-89c1-557693638420');

INSERT INTO public."Cupom"
(id, nome, desconto, observacao, descricao, validade, "dataAprovacao", "dataCadastro", ativo, aprovado, "influenciadorId", "usuarioId", "empresaId", motivo)
VALUES('09570704-3d65-4f1e-99ab-44fabb5cf662', 'CABELUDA', 30, '', '', '2050-12-13 00:00:00.000', '2022-12-28 14:45:07.000', '2021-02-01 00:00:00.000', true, true, '9ce732da-34a9-4adb-89c1-557693638420', NULL, 'c975f02c-cee8-4630-9fa8-239cc590dfe1', NULL);
INSERT INTO public."Cupom"
(id, nome, desconto, observacao, descricao, validade, "dataAprovacao", "dataCadastro", ativo, aprovado, "influenciadorId", "usuarioId", "empresaId", motivo)
VALUES('a0abff68-a9df-40fa-adb9-06016ecd63eb', 'CABELUDA2', 30, '', '', '2050-12-13 00:00:00.000', '2022-12-28 14:45:07.000', '2021-02-01 00:00:00.000', true, true, '150c98aa-4ea1-4329-91e1-fb5ff1b6701e', NULL, 'c975f02c-cee8-4630-9fa8-239cc590dfe1', NULL);

INSERT INTO public."Cliente"
(id, marketing, "pessoaId")
VALUES('283bea5f-7bbe-4f58-86d7-45da09bde2b3', true, '070e04ba-672c-418f-9d9c-2e9a583081d3');

INSERT INTO public."Pedido"
(id, "idExt", "dataPedido", observacao, "statusPedidoId", "pagamentoTipoId", "clienteId", "cupomId", "lojaId", descontos, valor, "dataAlteracao")
VALUES('eef9e6b6-1311-4d5f-968f-3926fb39afa7', '59123', '2023-04-07 10:38:43.000', NULL, '35be9020-e170-45c6-a9f4-e957ca373bfc', '24d069ae-fd0c-4aa6-9523-b7fc2fd4d675', '283bea5f-7bbe-4f58-86d7-45da09bde2b3', '09570704-3d65-4f1e-99ab-44fabb5cf662', '2f01c15a-e882-44ac-aedf-5f2754f24404', 30, 100, '2023-04-07 10:40:26.000');

INSERT INTO public."Saldo"
(valor, "empresaId", "influenciadorId", id, disponivel)
VALUES(0.0, 'c975f02c-cee8-4630-9fa8-239cc590dfe1', '9ce732da-34a9-4adb-89c1-557693638420', '6627012b-0f6a-4949-bdd8-9028a5d61310', 0.0);
INSERT INTO public."Saldo"
(valor, "empresaId", "influenciadorId", id, disponivel)
VALUES(0.0, 'c975f02c-cee8-4630-9fa8-239cc590dfe1', '150c98aa-4ea1-4329-91e1-fb5ff1b6701e', 'b177d25d-0d88-440c-ae8b-1d26b11be9e0', 0.0);

INSERT INTO public."ConviteSaldo"
(id, saldo, "influenciadorId", "empresaId")
VALUES('b08fec1a-2518-4bfa-977c-a91fdb2e01c3', 0, '9ce732da-34a9-4adb-89c1-557693638420', 'c975f02c-cee8-4630-9fa8-239cc590dfe1');
INSERT INTO public."ConviteSaldo"
(id, saldo, "influenciadorId", "empresaId")
VALUES('a14e09bc-de74-40c7-b7ce-62a451be5651', 0, '150c98aa-4ea1-4329-91e1-fb5ff1b6701e', 'c975f02c-cee8-4630-9fa8-239cc590dfe1');

