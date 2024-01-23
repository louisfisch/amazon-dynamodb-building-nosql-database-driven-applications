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

import fs from 'fs';
import path from 'path';
import url from 'url';

import { CreateFunctionCommand, Lambda } from '@aws-sdk/client-lambda';

// Define __dirname in ES module scope
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const lambdaClient = new Lambda({
    region: '<FMI>',
});

const IAM_ROLE_ARN = '<FMI>';

async function createLambdaFunction(zipFile) {
    const input = {
        Code: {
            ZipFile: Buffer.from(zipFile),
        },
        FunctionName: 'login',
        Handler: 'login.handler',
        Publish: true,
        Role: IAM_ROLE_ARN,
        Runtime: 'nodejs20.x',
        Timeout: 30,
    };

    const command = new CreateFunctionCommand(input);

    const response = await lambdaClient.send(command);

    return response;
}

(async () => {
    const zipFile = fs.readFileSync(path.resolve(__dirname, 'login.zip'));

    try {
        const response = await createLambdaFunction(zipFile);

        console.log(response);
    } catch (error) {
        console.error(error);
    }
})();
