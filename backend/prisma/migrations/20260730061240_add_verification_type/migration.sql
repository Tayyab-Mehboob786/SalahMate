-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "EmailVerification" ADD COLUMN     "type" "VerificationType" NOT NULL DEFAULT 'EMAIL_VERIFICATION';
