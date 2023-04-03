const { writeFileSync } = require('fs');


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
    const names = ['John', 'Jane', 'Joe', 'Jill', 'Jack', 'Jen', 'Jenny', 'Jesse', 'Jasper', 'Jenna', 'Jenifer', 'Jeff', 'Jeffrey'];

    const name = names[Math.floor(Math.random() * names.length)];

    return name;
}

function generateAddress() {
    const name = generateName();
    const address1 = '123 Main St';
    const city = 'New York';
    const state = 'NY';
    const zip = '10001';
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
    const statuses = ['processing', 'shipped', 'delivered'];

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return status;
}

function generateOrder(id) {
    const orderedProducts = Array(5).fill(0).map((_, i) => generateProduct(('prod_' + (i + 1))));

    const shippingAddress = generateAddress();

    const status = 'processing';

    const statusValue = generateStatusValue();

    return {
        id,
        shippingAddress,
        orderedProducts,
        status: {
            value: statusValue,
            lastUpdated: new Date().toISOString(),
            description: `Order is ${statusValue}`,
        },
    };
}

const orders = [];

for (let i = 1; i <= 40; i++) {
    const order = generateOrder(i.toString());
    orders.push(order);
}

const path = 'src/database/jsons/orders.json';

writeFileSync(path, JSON.stringify(orders, null, 2));
