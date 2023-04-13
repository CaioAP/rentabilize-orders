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
    "valor" DOUBLE PRECISION NOT NULL,
    "disponivel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "empresaId" TEXT NOT NULL,
    "influenciadorId" TEXT NOT NULL,

    CONSTRAINT "Saldo_pkey" PRIMARY KEY ("influenciadorId")
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

INSERT INTO public."Pessoa"
(id, "cpfCnpj", nome, email, instagram, "sexo", "dataNascimento", "dataCadastro", "dataAlteracao")
VALUES('5f3c509b-9cdb-4d7f-a2bc-29c703183fab', '32053578000100', 'BRK LOG', 'diego@mendesrocha.me', 'newhairoficial', NULL, NULL, '2016-03-10 16:17:16.000', '2022-12-12 20:36:04.000');

INSERT INTO public."Empresa"
(id, "razaoSocial", cnae, "inscricaoMunicipal", "inscricaoEstadual", "certificadoDigital", logo, "nivelRepasse", "conviteValor", "pessoaId")
VALUES('c975f02c-cee8-4630-9fa8-239cc590dfe1', 'BRK LOGISTICA E DISTRIBUICAO EIRELI', NULL, NULL, '107446154', NULL, NULL, 1, 180, '5f3c509b-9cdb-4d7f-a2bc-29c703183fab');

INSERT INTO public."Loja"
(id, nome, "chaveAcesso", senha, url, "empresaId", status, "marketplaceId")
VALUES('2f01c15a-e882-44ac-aedf-5f2754f24404', 'Loja New Hair', 'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT', 'Senha2321', 'https://loja.newhairoficial.com.br', 'c975f02c-cee8-4630-9fa8-239cc590dfe1', true, '9184beee-cde8-4eed-b516-65035f99b567');

