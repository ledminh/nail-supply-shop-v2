const { writeFileSync } = require("fs");

function generateRandomImage() {
  const x = Math.floor(Math.random() * 14) + 1;
  return {
    src: `/images/placeholder_${x}.png`,
    alt: `Placeholder ${x}`,
  };
}

function generateProduct(id) {
  const name = `Product ${id}`;
  const price = Math.floor(Math.random() * 100) + 1;
  const quantity = Math.floor(Math.random() * 10) + 1;
  const image = generateRandomImage();

  return {
    id,
    name,
    price,
    quantity,
    image,
  };
}

function generateName() {
  const names = [
    "John",
    "Jane",
    "Joe",
    "Jill",
    "Jack",
    "Jen",
    "Jenny",
    "Jesse",
    "Jasper",
    "Jenna",
    "Jenifer",
    "Jeff",
    "Jeffrey",
  ];

  const name = names[Math.floor(Math.random() * names.length)];

  return name;
}

function generateAddress() {
  const name = generateName();
  const address1 = "123 Main St";
  const city = "New York";
  const state = "NY";
  const zip = "10001";
  const email = `${name.toLowerCase()}.example.com`;

  return {
    name,
    address1,
    city,
    state,
    zip,
    email,
  };
}

function generateStatusValue() {
  const statuses = ["processing", "shipped", "delivered"];

  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return status;
}

// random date from the last 10 years, 50% chance of being in the last 3 months
function generateDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  let randomYear = year - Math.max(3, Math.floor(Math.random() * 10));
  let randomMonth, randomDay;

  // 50% chance of being in the last 3 months
  if (Math.random() < 0.5 && year - randomYear === 0) {
    randomMonth = month - Math.floor(Math.random() * 3);
  } else {
    randomMonth = Math.floor(Math.random() * 12);
  }

  let maxDate;
  if (randomMonth === 1 && new Date(randomYear, 1, 29).getDate() === 29) {
    maxDate = 29; // February of leap years
  } else {
    maxDate = new Date(randomYear, randomMonth + 1, 0).getDate() - 1;
  }

  randomDay = Math.floor(Math.random() * maxDate) + 1;

  const randomDate = new Date(randomYear, randomMonth, randomDay);

  // make sure the date is not in the future
  if (randomDate > now) {
    return now;
  }

  return randomDate;
}

function generateOrder(id) {
  const orderedProducts = Array(5)
    .fill(0)
    .map((_, i) => generateProduct("prod_" + (i + 1)));

  const shippingAddress = generateAddress();

  const status = "processing";

  const statusValue = generateStatusValue();

  return {
    id,
    shippingAddress,
    orderedProducts,
    status: {
      value: statusValue,
      lastUpdated: generateDate().toISOString(),
      description: `Order is ${statusValue}`,
    },
  };
}

const orders = [];

for (let i = 1; i <= 400; i++) {
  const order = generateOrder(i.toString());
  orders.push(order);
}

const path = "src/database/jsons/orders.json";

writeFileSync(path, JSON.stringify(orders, null, 2));
