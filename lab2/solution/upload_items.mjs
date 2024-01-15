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

import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDB({
    region: 'us-east-1',
});

async function createDragon(attack, defense, description, name, type) {
    const input = {
        Item: {
            'attack': {
                N: attack.toString(),
            },
            'defense': {
                N: defense.toString(),
            },
            'description': {
                S: description.toString(),
            },
            'name': {
                S: name.toString(),
            },
            'type': {
                S: type.toString(),
            },
        },
        ReturnConsumedCapacity: 'TOTAL',
        TableName: 'dragons',
    };

    const command = new PutItemCommand(input);

    try {
        const response = await dynamoDbClient.send(command);

        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

(async function createDragons() {
    createDragon(10, 7, 'breaths acid', 'sparky', 'green');
    createDragon(7, 10, 'breaths fire', 'tallie', 'red');
})();
