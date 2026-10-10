import prisma from "../src/config/prisma.js";

async function main() {
  console.log("Start seeding...");

  await prisma.role.upsert({
    where: {
      roleid: 1
    },
    update: {},
    create: {
      roleid: 1,
      rolename: "ADMIN"
    }
  });

  await prisma.role.upsert({
    where: {
      roleid: 2
    },
    update: {},
    create: {
      roleid: 2,
      rolename: "CUSTOMER"
    }
  });

  await prisma.membership.upsert({
    where: {
      mid: 1
    },
    update: {
      score: 10
    },
    create: {
      mid: 1,
      mname: "NORMAL",
      score: 10
    }
  });

  await prisma.membership.upsert({
    where: {
      mid: 2
    },
    update: {},
    create: {
      mid: 2,
      mname: "SILVER",
      score: 5
    }
  });

  await prisma.membership.upsert({
    where: {
      mid: 3
    },
    update: {},
    create: {
      mid: 3,
      mname: "GOLD",
      score: 10
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  