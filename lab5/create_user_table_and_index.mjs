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
    region: '<FMI>',
});

(async function createUsersTable() {
    const input = {
        AttributeDefinitions: [
            {
                AttributeName: 'email_address',
                AttributeType: 'S',
            }, {
                AttributeName: 'username',
                AttributeType: 'S',
            },
        ],
        KeySchema: [
            {
                <FMI>: 'username',
                KeyType: 'HASH',
            },
        ],
        <FMI>: 'PAY_PER_REQUEST',
        TableName: 'users',
        GlobalSecondaryIndexes: [
            {
                IndexName: 'email_address-index-exercise_5',
                KeySchema: [
                    {
                        AttributeName: 'email_address',
                        KeyType: 'HASH',
                    },
                ],
                Projection: {
                    NonKeyAttributes: [
                        '<FMI>',
                    ],
                    ProjectionType: 'INCLUDE',
                },
            },
        ],
    };

    const command = new CreateTableCommand(input);

    try {
        const response = await dynamoDbClient.send(command);

        console.log(response);
    } catch (error) {
        console.error(error);
    }
})();