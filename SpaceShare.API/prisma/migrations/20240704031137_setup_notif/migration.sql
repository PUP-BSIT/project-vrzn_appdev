/*
  Warnings:

  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `isApplication` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isReservation` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userToUpdate` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "user_id",
ADD COLUMN     "isApplication" BOOLEAN NOT NULL,
ADD COLUMN     "isReservation" BOOLEAN NOT NULL,
ADD COLUMN     "userToUpdate" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userToUpdate_fkey" FOREIGN KEY ("userToUpdate") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
