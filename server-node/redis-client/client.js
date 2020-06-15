// redis-client.js
const redis = require('redis');
const {promisify} = require('util');
const {v4} = require('uuid');

const client = redis.createClient(process.env.REDIS_URL);

const newClientSetup = () => {
    let now = new Date();

    const Tasks1 = ['Example Task'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            date: now.setDate(now.getDate() + index * 7),
            status: Math.random() >= 0.5
        }
    ));

    let Categories = ['Example Category'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            tasks: Tasks1,
            date: now.setDate(now.getDate() + index * 7),
        }
    ));

    return Categories
};

const setup = () => {
    let now = new Date();

    const Tasks1 = ['WWW', 'JPWP', 'UST', 'TR', 'CPS'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            date: now.setDate(now.getDate() + index * 7),
            status: Math.random() >= 0.5
        }
    ));

    const Tasks2 = ['Praca1', 'Praca2', 'CV'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            date: now.setDate(now.getDate() + index * 7),
            status: Math.random() >= 0.5
        }
    ));

    const Tasks3 = ['Morskie', 'Gory'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            date: now.setDate(now.getDate() + index * 7),
            status: Math.random() >= 0.5
        }
    ));

    const Tasks = [Tasks1, Tasks2, Tasks3];

    let Categories = ['Semestr Letni', 'Staż', 'Wakacje 2020'].map((str, index) => (
        {
            number: index,
            UUID: v4(),
            name: str,
            tasks: Tasks[index],
            date: now.setDate(now.getDate() + index * 7),
        }
    ));

    client.set("user:1", JSON.stringify(Categories));

    // This will return a JavaScript String
    client.get("user:1", function (err, reply) {
        const ans = JSON.parse(reply);
        console.log(ans[0].tasks); // Will print `OK`
    });
};


module.exports = {
    ...client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    keysAsync: promisify(client.keys).bind(client),
    setup,
    newClientSetup
};
