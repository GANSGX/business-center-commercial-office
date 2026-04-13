-- CreateEnum
CREATE TYPE "TenantRequestStatus" AS ENUM ('NEW', 'PROCESSED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "TenantRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "floor" INTEGER,
    "description" TEXT,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" "TenantRequestStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "TenantRequest_pkey" PRIMARY KEY ("id")
);
