-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_RoleId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "RoleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
