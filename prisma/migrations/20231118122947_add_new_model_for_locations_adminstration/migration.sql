/*
  Warnings:

  - You are about to drop the column `RoleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_RoleId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "RoleId",
ADD COLUMN     "admins" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "location_administration" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "location_administration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "location_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_positions_name_key" ON "location_positions"("name");

-- AddForeignKey
ALTER TABLE "location_administration" ADD CONSTRAINT "location_administration_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_administration" ADD CONSTRAINT "location_administration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
