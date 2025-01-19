/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Page_index_key" ON "Page"("index");
