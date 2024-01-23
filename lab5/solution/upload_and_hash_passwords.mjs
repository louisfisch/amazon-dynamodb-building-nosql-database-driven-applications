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

import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import url from 'url';

import { BatchWriteItemCommand, DynamoDB } from '@aws-sdk/client-dynamodb';

// Define __dirname in ES module scope
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const dynamoDbClient = new DynamoDB({
    region: 'us-east-1',
});

async function seedUsersTable() {
    const users = [];

    const USERS = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/users.json')));

    for (let i = 0; i < USERS.length; i++) {
        const password = bcrypt.hashSync(USERS[i].temp_password, 10);

        const user = {
            PutRequest: {
                Item: {
                    email_address: {
                        'S': USERS[i].email_address,
                    },
                    first_name: {
                        'S': USERS[i].first_name,
                    },
                    password: {
                        'S': password,
                    },
                    username: {
                        'S': USERS[i].username,
                    },
                },
            },
        };

        users.push(user);
    }

    const input = {
        RequestItems: {
            'users': users.reverse(),
        },
    };

    const command = new BatchWriteItemCommand(input);

    const response = await dynamoDbClient.send(command);

    return response;
}

(async function seedTables() {
    console.time('How fast was that?');
    try {
        response = await seedUsersTable();

        console.log(response);
    } catch (error) {
        console.error(error);
    }
    console.timeEnd('How fast was that?');
})();
