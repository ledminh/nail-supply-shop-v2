const fs = require("fs");
const path = require("path");

const type = process.argv[2];
const componentNames = process.argv.slice(3);

const basePath = path.join(__dirname, "src", "styles", type);

const content = `.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(63, 63, 63);
    border: 2px solid rgb(0, 0, 0);
    color: #fff;
    padding: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    border-radius: 0.5rem;
}`;

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

componentNames.forEach((name) => {
  const filename = `${name}.module.scss`;
  const filePath = path.join(basePath, filename);
  if (fs.existsSync(filePath)) {
    console.log(`File ${filename} already exists, skipping...`);
    return;
  }
  fs.writeFileSync(filePath, content);
  console.log(`Created file ${filename}`);
});
