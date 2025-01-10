/*
  Warnings:

  - A unique constraint covering the columns `[bankName]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bank_bankName_key" ON "Bank"("bankName");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_email_key" ON "Bank"("email");
