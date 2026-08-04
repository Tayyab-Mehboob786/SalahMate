-- CreateEnum
CREATE TYPE "Prayer" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('COMPLETED', 'MISSED', 'QADA');

-- CreateTable
CREATE TABLE "PrayerLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prayer" "Prayer" NOT NULL,
    "status" "PrayerStatus" NOT NULL,
    "date" TEXT NOT NULL,
    "prayedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrayerLog_userId_prayer_date_key" ON "PrayerLog"("userId", "prayer", "date");

-- AddForeignKey
ALTER TABLE "PrayerLog" ADD CONSTRAINT "PrayerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
