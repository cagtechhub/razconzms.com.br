-- CreateEnum
CREATE TYPE "razconms"."LeadActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'NOTE_ADDED');

-- CreateTable
CREATE TABLE "razconms"."lead_activities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "type" "razconms"."LeadActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "razconms"."team_members" ADD COLUMN "instagram_url" TEXT;
ALTER TABLE "razconms"."team_members" ADD COLUMN "linkedin_url" TEXT;
ALTER TABLE "razconms"."team_members" ADD COLUMN "facebook_url" TEXT;

-- CreateTable
CREATE TABLE "razconms"."plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[] NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "show_price" BOOLEAN NOT NULL DEFAULT true,
    "price_original_cents" INTEGER,
    "price_promo_cents" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "cta_label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_activities_lead_id_created_at_idx" ON "razconms"."lead_activities"("lead_id", "created_at");

-- CreateIndex
CREATE INDEX "plans_active_sort_order_idx" ON "razconms"."plans"("active", "sort_order");

-- AddForeignKey
ALTER TABLE "razconms"."lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "razconms"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed plans
INSERT INTO "razconms"."plans" (
  "id",
  "name",
  "description",
  "features",
  "featured",
  "show_price",
  "price_original_cents",
  "price_promo_cents",
  "sort_order",
  "active",
  "cta_label",
  "created_at",
  "updated_at"
)
VALUES
  (
    'cm_plan_essencial',
    'Essencial',
    'Para empresas que estão começando e precisam de uma base segura.',
    ARRAY['Contabilidade mensal', 'Obrigações fiscais', 'Atendimento por e-mail'],
    false,
    true,
    39900,
    NULL,
    0,
    true,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'cm_plan_gestao',
    'Gestão',
    'Mais acompanhamento para empresas em fase de crescimento.',
    ARRAY['Tudo do Essencial', 'Folha de pagamento', 'Reunião de acompanhamento', 'Relatórios gerenciais'],
    true,
    true,
    79900,
    NULL,
    1,
    true,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'cm_plan_sobmedida',
    'Sob medida',
    'Uma estrutura desenhada para a complexidade e os objetivos do seu negócio.',
    ARRAY['Escopo personalizado', 'Consultoria estratégica', 'Canal direto com especialistas'],
    false,
    false,
    NULL,
    NULL,
    2,
    true,
    'Vamos conversar',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
