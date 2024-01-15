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

import { CreateTableCommand, DynamoDB } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDB({
    region: 'us-east-1',
});

async function createDragonBonusAttackTable() {
    const command = new CreateTableCommand({
        AttributeDefinitions: [
            {
                AttributeName: 'breath_attack',
                AttributeType: 'S',
            }, {
                AttributeName: 'range',
                AttributeType: 'N',
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
            {
                AttributeName: 'breath_attack',
                KeyType: 'HASH',
            }, {
                AttributeName: 'range',
                KeyType: 'RANGE',
            },
        ],
        TableName: 'dragon_bonus_attack',
    });

    const response = await dynamoDbClient.send(command);

    return response;
}

async function createDragonCurrentPowerTable() {
    const command = new CreateTableCommand({
        AttributeDefinitions: [
            {
                AttributeName: 'game_id',
                AttributeType: 'S',
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
            {
                AttributeName: 'game_id',
                KeyType: 'HASH',
            },
        ],
        TableName: 'dragon_current_power',
    });

    const response = await dynamoDbClient.send(command);

    return response;
}

async function createDragonFamilyTable() {
    const command = new CreateTableCommand({
        AttributeDefinitions: [
            {
                AttributeName: 'family',
                AttributeType: 'S',
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
            {
                AttributeName: 'family',
                KeyType: 'HASH',
            },
        ],
        TableName: 'dragon_family',
    });

    const response = await dynamoDbClient.send(command);

    return response;
}

async function createDragonStatsTable() {
    const command = new CreateTableCommand({
        AttributeDefinitions: [
            {
                AttributeName: 'name',
                AttributeType: 'S',
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
            {
                AttributeName: 'name',
                KeyType: 'HASH',
            },
        ],
        TableName: 'dragon_stats',
    });

    const response = await dynamoDbClient.send(command);

    return response;
}

(async function createTables() {
    console.time('How fast was that?');
    Promise.allSettled([
        createDragonStatsTable(),
        createDragonCurrentPowerTable(),
        createDragonBonusAttackTable(),
        createDragonFamilyTable(),
    ]).then((values) => {
        console.log(values);
    }).catch((error) => {
        console.error(error);
    });
    console.timeEnd('How fast was that?');
})();
