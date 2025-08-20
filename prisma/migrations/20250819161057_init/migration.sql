/*
  Warnings:

  - The `photos` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amenities` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "photos",
ADD COLUMN     "photos" TEXT[],
DROP COLUMN "amenities",
ADD COLUMN     "amenities" TEXT[];
