/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_property_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tenant_id_fkey";

-- DropTable
DROP TABLE "Booking";

-- CreateTable
CREATE TABLE "SpaceHistory" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpaceHistory" ADD CONSTRAINT "SpaceHistory_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceHistory" ADD CONSTRAINT "SpaceHistory_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
