import prisma from "../config/prisma.js";

const username = process.argv[2];

if (!username) {
  console.error(
    "Usage: node src/scripts/make-admin.js username"
  );

  process.exit(1);
}

async function main() {
  const adminRole = await prisma.role.findFirst({
    where: {
      rolename: "ADMIN"
    }
  });

  if (!adminRole) {
    throw new Error("ADMIN role not found");
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase()
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      uid: user.uid
    },
    data: {
      roleid: adminRole.roleid
    }
  });

  console.log(
    `${updatedUser.username} is now ADMIN`
  );
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });