-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "numProductsAndGroups" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "numProducts" SET DEFAULT 0;
