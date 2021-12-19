const csv = require('csvtojson');
const AWS = require('aws-sdk');
const axios = require('axios');
const unzipper = require('unzipper');
const { Readable } = require('stream');

const s3 = new AWS.S3({
    region: 'us-east-1'
});

const bucket = 'top-sites-list';

const chunkArray = (inputArray, perChunk) => {
    return inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, []);
}

module.exports.fetchTopSites = async event => {

    try {

        await s3.putObject({
            Bucket: bucket,
            Key: 'test.json',
            Body: '{"hello": "world"}',
            ContentType: 'application/json',
        }).promise();

        const { data } = await axios.get('http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip', {
            responseType: 'arraybuffer'
        });

        const stream = Readable.from(data);

        // Unzip
        const csvStream = stream
            .on("error", e => console.error('Could not extract file', e))
            .pipe(
                unzipper.ParseOne('top-1m.csv', {
                    forceStream: true
                })
            );

        const csvData = await csv({
            noheader: true,
            headers: ['rank', 'url']
        }).fromStream(csvStream);

        const alphabetRaw = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const alphabet = alphabetRaw.split('');

        // Split domains by letter
        for (const character of alphabet) {
            const filtered = csvData.filter(item => item.url.startsWith(character));

            // Save the first two letters to a JSON file
            for (const secondChar of alphabet) {
                const filteredSecond = filtered.filter(item => item.url.charAt(1) === secondChar);
                if (!filteredSecond.length) continue;
                const key = `characters/${character}${secondChar}.json`;
                const output = JSON.stringify(filteredSecond);
                await s3.putObject({
                    Bucket: bucket,
                    Key: key,
                    Body: output,
                    ContentType: 'application/json',
                }).promise();
                console.log(`Put object: ${key}`);
            }
        }

        // Split domains by rank
        const chunks = chunkArray(csvData, 1000);
        for (const [index, chunk] of chunks.entries()) {
            const key = `pages/${index + 1}.json`;
            const output = JSON.stringify(chunk);
            // Save the JSON
            await s3.putObject({
                Bucket: bucket,
                Key: key,
                Body: output,
                ContentType: 'application/json',
            }).promise();

            console.log(`Put object: ${key}`);
        }
    } catch (err) {
        console.error(err);
    }
}