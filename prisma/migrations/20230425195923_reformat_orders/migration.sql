/*
  Warnings:

  - Added the required column `orderId` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "orderId" TEXT NOT NULL;
