DROP INDEX "User_email_key";

ALTER TABLE "Order" RENAME COLUMN "createdat" TO "creatat";
ALTER TABLE "Order" DROP COLUMN "status";
ALTER TABLE "Order" DROP COLUMN "totalamount";

ALTER TABLE "OrderDetail" RENAME COLUMN "quantity" TO "qty";
ALTER TABLE "OrderDetail" RENAME COLUMN "price" TO "unit_price";

ALTER TABLE "Product" RENAME COLUMN "pname" TO "name";
ALTER TABLE "Product" RENAME COLUMN "stock" TO "quantity";
ALTER TABLE "Product" DROP COLUMN "description";

ALTER TABLE "Role" RENAME COLUMN "rname" TO "rolename";

ALTER TABLE "Shipment" RENAME COLUMN "shipstatus" TO "status";
ALTER TABLE "Shipment" DROP COLUMN "address";
ALTER TABLE "Shipment" DROP COLUMN "shippedat";

ALTER TABLE "User" ADD COLUMN "username" VARCHAR(50);

UPDATE "User"
SET "username" = "email";

ALTER TABLE "User"
ALTER COLUMN "username" SET NOT NULL;

ALTER TABLE "User" DROP COLUMN "address";
ALTER TABLE "User" DROP COLUMN "email";

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");