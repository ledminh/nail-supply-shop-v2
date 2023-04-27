/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderID]` on the table `ShippingAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddressId";

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderID_key" ON "ShippingAddress"("orderID");
