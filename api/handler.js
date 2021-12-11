const csv = require('csvtojson');
const fs = require('fs-extra');
const path = require('path');

module.exports.topSites = async event => {

    const data = await csv({
        noheader: true,
        headers: ['rank', 'url']
    }).fromFile('./top-1m.csv');

    const topLevelAcceptable = ['co', 'com'];
    const onlyDomains = data.map(({ url }) => {
        const split = url.split('.');
        const slice = topLevelAcceptable.includes(split[split.length - 2]) ? -3 : -2;
        return split.slice(slice).join('.');
    });
    const noDuplicates = [...new Set(onlyDomains)];
    
    const output = JSON.stringify(noDuplicates, null, 4);

    fs.writeFileSync('./output.json', output);

    return {
        statusCode: 200,
        body: 'hello'
    }
}