/*
  Warnings:

  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "message" TEXT NOT NULL,
ALTER COLUMN "is_read" SET DEFAULT false;
