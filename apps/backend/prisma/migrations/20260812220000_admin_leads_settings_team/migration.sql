-- CreateEnum
CREATE TYPE "LeadChannel" AS ENUM ('WEBSITE', 'WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'REFERRAL', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "channel" "LeadChannel" NOT NULL DEFAULT 'WEBSITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "contact_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "site_url" TEXT NOT NULL DEFAULT '',
    "site_name" TEXT NOT NULL DEFAULT 'Razcon Soluções Contábeis',
    "seo_locality" TEXT NOT NULL DEFAULT 'Brasil',
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "business_address" TEXT NOT NULL DEFAULT '',
    "business_phone" TEXT NOT NULL DEFAULT '',
    "contact_email" TEXT NOT NULL DEFAULT 'contato@razconms.com.br',
    "whatsapp_number" TEXT NOT NULL DEFAULT '',
    "whatsapp_message" TEXT NOT NULL DEFAULT 'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.',
    "instagram_url" TEXT NOT NULL DEFAULT '',
    "facebook_url" TEXT NOT NULL DEFAULT '',
    "linkedin_url" TEXT NOT NULL DEFAULT '',
    "default_og_image_url" TEXT NOT NULL DEFAULT '',
    "ga4_measurement_id" TEXT NOT NULL DEFAULT '',
    "meta_pixel_id" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "image_url" TEXT,
    "storage_path" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_channel_idx" ON "leads"("channel");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "team_members_active_idx" ON "team_members"("active");

-- CreateIndex
CREATE INDEX "team_members_sort_order_idx" ON "team_members"("sort_order");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed team
INSERT INTO "team_members" ("id", "name", "role", "initials", "image_url", "sort_order", "active", "created_at", "updated_at")
VALUES
  ('cm_team_rita', 'Rita', 'Diretora', 'RT', '/img/team/rita.jpeg', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cm_team_tiago', 'Tiago', 'Especialista contábil', 'TA', '/img/team/tiago.jpeg', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cm_team_debora', 'Debora', 'Especialista fiscal', 'DE', '/img/team/debora.jpeg', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cm_team_caroline', 'Caroline', 'Departamento pessoal', 'CN', NULL, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed settings singleton
INSERT INTO "site_settings" ("id", "site_name", "seo_locality", "contact_email", "whatsapp_message", "created_at", "updated_at")
VALUES (
  'default',
  'Razcon Soluções Contábeis',
  'Brasil',
  'contato@razconms.com.br',
  'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
