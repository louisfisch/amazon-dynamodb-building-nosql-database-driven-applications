/*
* Copyright 2010 Amazon.com, Inc. or its affiliates
* Copyright 2024 Louis Fischer.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDB({
    region: 'us-east-1',
});

export async function handler(event, context, callback) {
    console.info('To run a local test in Cloud9 use "node scan_dragons.js test"');

    console.info('Running in Lambda');

    try {
        let items;

        if (event['dragon_name'] !== undefined && event['dragon_name'] !== 'all') {
            items = await getDragonByName(event['dragon_name']);
        } else {
            items = await getAllDragons();
        }

        if (items) {
            callback(null, items);
        } else {
            callback(null, []);
        }
    } catch (error) {
        console.error(error);

        callback(error, null);
    }
};

async function getAllDragons() {
    const input = {
        ExpressionAttributeNames: {
            '#family': 'family',
            '#name': 'name',
        },
        ProjectionExpression: 'damage, description, #family, #name, protection',
        TableName: 'dragon_stats',
    };

    const command = new ScanCommand(input);

    const response = dynamoDbClient.send(command);

    return response.Items;
}

async function getDragonByName(name) {
    const input = {
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': {
                S: name,
            },
        },
        FilterExpression: '#name = :name',
        TableName: 'dragon_stats',
    };

    const command = new ScanCommand(input);

    const response = dynamoDbClient.send(command);

    return response.Items;
}

if (process.argv[2] === 'test') {
    try {
        let items;

        if (process.argv[3] !== undefined && process.argv[3] !== 'all') {
            console.info(`Local test for a dragon called ${process.argv[3]}`);

            items = await getDragonByName(process.argv[3]);
        } else {
            console.info('Local test for all dragons');

            items = await getAllDragons();
        }

        if (items) {
            console.log(items);
        } else {
            console.log([]);
        }
    } catch (error) {
        console.error(error);
    }
}
