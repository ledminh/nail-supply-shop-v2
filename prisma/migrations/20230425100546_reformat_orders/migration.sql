/*
  Warnings:

  - You are about to drop the column `orderProductIds` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderedProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderedProduct" DROP CONSTRAINT "OrderedProduct_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderProductIds";

-- AlterTable
ALTER TABLE "OrderedProduct" DROP COLUMN "orderId";

-- AddForeignKey
ALTER TABLE "OrderedProduct" ADD CONSTRAINT "OrderedProduct_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
