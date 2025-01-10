-- CreateEnum
CREATE TYPE "AchivementBadges" AS ENUM ('NewRecruit', 'ThreeDayStreak', 'WeeklyStreak', 'MonthyStreak', 'GenerousGiver', 'CommunityChamp', 'LeaderboardChallenger', 'RecipeMaster');

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bankRegistration" (
    "id" SERIAL NOT NULL,
    "bankName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bankRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePictureURL" TEXT NOT NULL,
    "password" TEXT,
    "providerId" TEXT NOT NULL,
    "myReferralCode" TEXT NOT NULL,
    "wasReferred" TEXT,
    "streak" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referrals" (
    "id" SERIAL NOT NULL,
    "joineeId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,

    CONSTRAINT "Referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achivements" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "badge" "AchivementBadges" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achivements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCoupon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "validTill" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponDispatch" (
    "id" SERIAL NOT NULL,
    "discountCouponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CouponDispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "barcode" TEXT,
    "qty" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" TEXT[],
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodDonation" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverBankId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "approval" BOOLEAN NOT NULL DEFAULT false,
    "receivedFood" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FoodDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_myReferralCode_key" ON "User"("myReferralCode");

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_joineeId_fkey" FOREIGN KEY ("joineeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponDispatch" ADD CONSTRAINT "CouponDispatch_discountCouponId_fkey" FOREIGN KEY ("discountCouponId") REFERENCES "DiscountCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponDispatch" ADD CONSTRAINT "CouponDispatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodDonation" ADD CONSTRAINT "FoodDonation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodDonation" ADD CONSTRAINT "FoodDonation_receiverBankId_fkey" FOREIGN KEY ("receiverBankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
