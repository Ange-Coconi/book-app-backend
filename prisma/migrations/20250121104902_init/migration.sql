/*
  Warnings:

  - Added the required column `format` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `padding` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "padding" TEXT NOT NULL;
