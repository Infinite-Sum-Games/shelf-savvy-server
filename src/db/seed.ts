import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { AchivementBadges } from "@prisma/client";
import { newHash } from "@src/encryption/hash";

const prisma = new PrismaClient();

function randomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

async function userSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;

  await prisma.user.createMany({
    data: users,
  });

  createdUsers = await prisma.user.findMany();
}

async function bankSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "bankRegistration" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Bank" RESTART IDENTITY CASCADE`;

  const bankRegistration: {
    bankName: string;
    email: string;
    password: string;
    otp: string;
    expiryAt: Date;
  }[] = [];

  const bank: {
    bankName: string;
    email: string;
    password: string;
  }[] = [];

  for (let i = 0; i < 7; i++) {
    bankRegistration.push({
      bankName: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      otp: faker.number.int({ min: 100000, max: 999999 }).toString(),
      expiryAt: faker.date.future(),
    });
  }

  for (const bankReg of bankRegistration) {
    var r = Math.random();
    if (r > 0.3) {
      bank.push({
        bankName: bankReg.bankName,
        email: bankReg.email,
        password: bankReg.password,
      });
    }
  }

  await prisma.bankRegistration.createMany({
    data: bankRegistration,
  });

  await prisma.bank.createMany({
    data: bank,
  });

  bankData = await prisma.bank.findMany();
}

async function achivementsSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "Achivements" RESTART IDENTITY CASCADE`;

  const achievements: {
    userId: string;
    badge: AchivementBadges;
  }[] = [];

  for (const user of createdUsers) {
    var r = Math.random();
    if (r > 0.3) {
      achievements.push({
        userId: user.id,
        badge: faker.helpers.enumValue(AchivementBadges),
      });
    }
  }

  await prisma.achivements.createMany({
    data: achievements,
  });
}

async function inventorySeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "Inventory" RESTART IDENTITY CASCADE`;

  const inventory: {
    itemName: string;
    qty: number;
    email: string;
  }[] = [];

  for (const user of createdUsers) {
    inventory.push({
      itemName: faker.commerce.productName(),
      qty: faker.number.int({ min: 0, max: 100 }),
      email: user.email,
    });
  }

  await prisma.inventory.createMany({
    data: inventory,
  });
}

async function recipeSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "Recipe" RESTART IDENTITY CASCADE`;

  const recipes: {
    userId: string;
    title: string;
    ingredients: string[];
    content: string;
  }[] = [];

  for (const user of createdUsers) {
    recipes.push({
      userId: user.id,
      title: faker.lorem.sentence(),
      ingredients: [
        faker.commerce.productName(),
        faker.commerce.productName(),
        faker.commerce.productName(),
        faker.commerce.productName(),
      ],
      content: faker.lorem.paragraph(),
    });
  }

  await prisma.recipe.createMany({
    data: recipes,
  });
}

async function foodDonationSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "FoodDonation" RESTART IDENTITY CASCADE`;

  const foodDonations: {
    senderId: string;
    receiverBankId: string;
    content: string;
    approval: boolean;
    receivedFood: boolean;
  }[] = [];

  for (let i = 0; i < 5; i++) {
    let randomUserNum = randomInt(createdUsers.length - 1);
    let randomBankNum = randomInt(bankData.length - 1);
    foodDonations.push({
      senderId: createdUsers[randomUserNum].id,
      receiverBankId: bankData[randomBankNum].id,
      content: faker.lorem.paragraph(),
      approval: faker.datatype.boolean(),
      receivedFood: faker.datatype.boolean(),
    });
  }

  await prisma.foodDonation.createMany({
    data: foodDonations,
  });
}

async function pointsSeed() {
  await prisma.$executeRaw`TRUNCATE TABLE "Points" RESTART IDENTITY CASCADE`;

  const points: {
    userId: string;
    point: number;
  }[] = [];

  for (const user of createdUsers) {
    points.push({
      userId: user.id,
      point: faker.number.int({ min: 0, max: 100 }),
    });
  }

  await prisma.points.createMany({
    data: points,
  });
}

// User details
const users: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePictureURL: string;
  password: string;
  providerId: string;
  myReferralCode: string;
  wasReferred: string | null;
  streak: number;
  totalPoints: number;
}[] = [];

let createdUsers: any[] = [];
let bankData: any[] = [];

async function main() {
  for (let i = 0; i < 10; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      profilePictureURL: faker.image.url(),
      password: newHash(newHash(faker.internet.password())),
      providerId: faker.number.int({ min: 100000, max: 999999 }).toString(),
      myReferralCode: faker.number.int({ min: 100000, max: 999999 }).toString(),
      wasReferred: faker.helpers.arrayElement(["yes", null]),
      streak: faker.number.int({ min: 0, max: 100 }),
      totalPoints: faker.number.int({ min: 0, max: 100 }),
    });
  }

  console.log("Seed data created successfully");
  await userSeed();
  await bankSeed();
  await achivementsSeed();
  await inventorySeed();
  await recipeSeed();
  await foodDonationSeed();
  await pointsSeed();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
