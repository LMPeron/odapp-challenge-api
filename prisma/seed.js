const { PrismaClient } = require('@prisma/client');

const patients = require('./data/patients.js');
const states = require('./data/states.js');

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // console.log(`states...`);
  // for (const state of states) {
  //   await prisma.state.create({
  //     data: state,
  //   });
  //   console.log(`state ${state.name} created`);
  // }

  console.log(`patients...`);
  for (const patient of patients) {
    await prisma.patient.create({
      data: patient,
    });
    console.log(`patient ${patient.name} created`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
