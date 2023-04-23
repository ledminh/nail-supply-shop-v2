/*
  Warnings:

  - You are about to drop the column `orderID` on the `ShippingAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shippingAddressId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrderedProduct" DROP CONSTRAINT "OrderedProduct_orderID_fkey";

-- DropForeignKey
ALTER TABLE "ShippingAddress" DROP CONSTRAINT "ShippingAddress_orderID_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderProductIds" TEXT[];

-- AlterTable
ALTER TABLE "OrderedProduct" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "orderID";

-- CreateIndex
CREATE UNIQUE INDEX "Order_shippingAddressId_key" ON "Order"("shippingAddressId");

-- AddForeignKey
ALTER TABLE "OrderedProduct" ADD CONSTRAINT "OrderedProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "ShippingAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
