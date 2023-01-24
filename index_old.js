const NodeGeocoder = require('node-geocoder');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = {
  provider: 'google',
  apiKey: process.env.API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

async function getGeocoder(value) {
  value = `${value}`;
  if (value === 'undefined' || value.length <= 0) return;
  try {
    const res = await geocoder.geocode(value);
    const data = {
      formattedAddress: res[0].formattedAddress,
      latitude: res[0].latitude,
      longitude: res[0].longitude,
      streetName: res[0].streetName,
      country: res[0].country,
      countryCode: res[0].countryCode,
      zipcode: res[0].zipcode,
    };
    console.log(`>>>>>> `, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`>>>>>> `, JSON.stringify(error, null, 2));
  }
}

// getGeocoder('Rua Casa do Ator, 1117, Vila Olímpia, Brasil');
rl.question('Digite um enderço: ', async text => {
  await getGeocoder(text);
  process.exit(0);
});
