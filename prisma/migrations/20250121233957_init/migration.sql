/*
  Warnings:

  - You are about to drop the column `name` on the `Page` table. All the data in the column will be lost.
  - Made the column `content` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "name",
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '';
