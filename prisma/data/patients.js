module.exports = [
  {
    name: 'José da Silva',
    age: 30,
    Location: {
      create: {
        State: {
          connect: {
            id: 1,
          },
        },
        City: {
          connect: {
            id: 1,
          },
        },
      },
    },
  },
  {
    name: 'Maria da Silva',
    age: 25,
    Location: {
      create: {
        State: {
          connect: {
            id: 1,
          },
        },
        City: {
          connect: {
            id: 2,
          },
        },
      },
    },
  },
];
