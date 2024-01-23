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
import { v4 as uuidv4 } from 'uuid';

import { DynamoDB, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDB({
    region: 'eu-west-3',
});

const SESSION_TIMEOUT_IN_MINUTES = 20;

export async function handler(event, context, callback) {
    console.info('To run a Local test in Cloud9 use "node login.js test {email_address} {attempted_password}"');

    console.info('Running in Lambda');

    if (event['email_address'] && event['attempted_password']) {
        try {
            const session = await login(event['attempted_password'], event['email_address']);

            callback(null, session);
        } catch (error) {
            console.error(error);

            callback(error, null);
        }
    } else {
        callback('No credentials provided', null);
    }
}

async function createSession(id, username) {
    const input = {
        Item: {
            'expiration_time': {
                N: String((Math.floor((new Date).getTime() / 1000) + (60 * SESSION_TIMEOUT_IN_MINUTES))),
            },
            'id': {
                S: id,
            },
            'username': {
                S: username,
            },
        },
        ReturnConsumedCapacity: 'TOTAL',
        TableName: 'sessions',
    };

    const command = new PutItemCommand(input);

    const response = await dynamoDbClient.send(command);

    return response;
}

async function login(attempted_password, email_address) {
    const input = {
        ExpressionAttributeValues: {
            ':email_address': {
                S: email_address,
            },
        },
        IndexName: 'email_address-index-exercise_5',
        KeyConditionExpression: 'email_address = :email_address',
        TableName: 'users',
    };

    const command = new QueryCommand(input);

    const response = await dynamoDbClient.send(command);

    if (response.Items && response.Items[0]) {
        const new_session_id = uuidv4();

        console.log(response.Items[0].password.S, attempted_password);

        if (bcrypt.compareSync(attempted_password, response.Items[0].password.S) === true) {
            console.log('Password is correct');

            const session = await createSession(new_session_id, response.Items[0].username.S);

            console.log(session);

            return {
                username: response.Items[0].username.S,
                session_id: new_session_id,
            };
        } else {
            throw new Error('Password does not match email address');
        }
    } else {
        throw new Error('Invalid credentials');
    }
}

if (process.argv[2] === 'test') {
    if (process.argv[3] && process.argv[4]) {
        console.info(`Local test to log in a user with email address ${process.argv[3]}`);

        try {
            const session = await login(process.argv[4], process.argv[3]);

            console.log(session);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('No credentials provided');
    }
}
