/*
  Warnings:

  - A unique constraint covering the columns `[rtspUrl]` on the table `Camera` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Camera_rtspUrl_key" ON "Camera"("rtspUrl");
