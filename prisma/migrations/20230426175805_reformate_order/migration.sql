/*
  Warnings:

  - Added the required column `orderID` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- DropIndex
DROP INDEX "Order_shippingAddressId_key";

-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "orderID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
