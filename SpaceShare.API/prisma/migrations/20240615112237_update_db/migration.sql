/*
  Warnings:

  - Added the required column `area` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedroom` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "area" INTEGER NOT NULL,
ADD COLUMN     "bedroom" INTEGER NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;
