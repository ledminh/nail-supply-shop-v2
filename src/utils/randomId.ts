// random id generator with params for length and prefix, only numbers
export default function randomId(length = 10, prefix = "") {
  let result = prefix;
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
