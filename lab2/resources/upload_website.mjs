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

import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';

const s3Client = new S3({
    region: 'us-east-1',
});

const bucketName = '<FMI>';

async function uploadObject(key, contentType, body) {
    const input = {
        Body: body,
        Bucket: bucketName,
        CacheControl: 'max-age=0',
        ContentType: contentType,
        Key: key,
    };

    const command = new PutObjectCommand(input);

    try {
        const response = await s3Client.send(command);

        console.log(response);
    } catch (error) {
        console.error(error, error.stack);
    }
}

(() => {
    uploadObject('ajax.mjs', 'application/javascript', fs.readFileSync('website/ajax.mjs'));
    uploadObject('config.mjs', 'application/javascript', fs.readFileSync('website/config.mjs'));
    uploadObject('elements.mjs', 'application/javascript', fs.readFileSync('website/elements.mjs'));
    uploadObject('lib/jquery-3.4.0.min.js', 'application/javascript', fs.readFileSync('website/lib/jquery-3.4.0.min.js'));

    // Upload index.html and related files
    uploadObject('index.html', 'text/html', fs.readFileSync('website/index.html'));
    uploadObject('assets/styles/main.css', 'text/css', fs.readFileSync('website/assets/styles/main.css'));
    uploadObject('main.mjs', 'application/javascript', fs.readFileSync('website/main.mjs'));

    // Upload index2.html and related files
    uploadObject('index2.html', 'text/html', fs.readFileSync('website/index2.html'));
    uploadObject('assets/styles/main2.css', 'text/css', fs.readFileSync('website/assets/styles/main2.css'));
    uploadObject('main2.mjs', 'application/javascript', fs.readFileSync('website/main2.mjs'));

    // Upload index3.html and related files
    uploadObject('index3.html', 'text/html', fs.readFileSync('website/index3.html'));
    uploadObject('main3.mjs', 'application/javascript', fs.readFileSync('website/main3.mjs'));
    uploadObject('assets/styles/main3.css', 'text/css', fs.readFileSync('website/assets/styles/main3.css'));

    // Upload index4.html and related files
    uploadObject('index4.html', 'text/html', fs.readFileSync('website/index4.html'));
    uploadObject('main4.mjs', 'application/javascript', fs.readFileSync('website/main4.mjs'));
    uploadObject('assets/styles/main4.css', 'text/css', fs.readFileSync('website/assets/styles/main4.css'));

    // Upload index5.html and related files
    uploadObject('index5.html', 'text/html', fs.readFileSync('website/index5.html'));
    uploadObject('main5.mjs', 'application/javascript', fs.readFileSync('website/main5.mjs'));
    uploadObject('assets/styles/main5.css', 'text/css', fs.readFileSync('website/assets/styles/main5.css'));

    // Dragons
    uploadObject('assets/images/sparky.png', 'image/png', fs.readFileSync('website/assets/images/sparky.png'));
    uploadObject('assets/images/tallie.png', 'image/png', fs.readFileSync('website/assets/images/tallie.png'));

    // Mary's dragons for a future lab
    uploadObject('assets/images/amaron.png', 'image/png', fs.readFileSync('website/assets/images/amaron.png'));
    uploadObject('assets/images/atlas.png', 'image/png', fs.readFileSync('website/assets/images/atlas.png'));
    uploadObject('assets/images/bahamethut.png', 'image/png', fs.readFileSync('website/assets/images/bahamethut.png'));
    uploadObject('assets/images/blackhole.png', 'image/png', fs.readFileSync('website/assets/images/blackhole.png'));
    uploadObject('assets/images/cassidiuma.png', 'image/png', fs.readFileSync('website/assets/images/cassidiuma.png'));
    uploadObject('assets/images/castral.png', 'image/png', fs.readFileSync('website/assets/images/castral.png'));
    uploadObject('assets/images/crimson.png', 'image/png', fs.readFileSync('website/assets/images/crimson.png'));
    uploadObject('assets/images/dexler.png', 'image/png', fs.readFileSync('website/assets/images/dexler.png'));
    uploadObject('assets/images/eislex.png', 'image/png', fs.readFileSync('website/assets/images/eislex.png'));
    uploadObject('assets/images/fireball.png', 'image/png', fs.readFileSync('website/assets/images/fireball.png'));
    uploadObject('assets/images/firestorm.png', 'image/png', fs.readFileSync('website/assets/images/firestorm.png'));
    uploadObject('assets/images/frealu.png', 'image/png', fs.readFileSync('website/assets/images/frealu.png'));
    uploadObject('assets/images/frost.png', 'image/png', fs.readFileSync('website/assets/images/frost.png'));
    uploadObject('assets/images/galadi.png', 'image/png', fs.readFileSync('website/assets/images/galadi.png'));
    uploadObject('assets/images/havarth.png', 'image/png', fs.readFileSync('website/assets/images/havarth.png'));
    uploadObject('assets/images/herma.png', 'image/png', fs.readFileSync('website/assets/images/herma.png'));
    uploadObject('assets/images/hydraysha.png', 'image/png', fs.readFileSync('website/assets/images/hydraysha.png'));
    uploadObject('assets/images/isilier.png', 'image/png', fs.readFileSync('website/assets/images/isilier.png'));
    uploadObject('assets/images/jerichombur.png', 'image/png', fs.readFileSync('website/assets/images/jerichombur.png'));
    uploadObject('assets/images/languatha.png', 'image/png', fs.readFileSync('website/assets/images/languatha.png'));
    uploadObject('assets/images/longlu.png', 'image/png', fs.readFileSync('website/assets/images/longlu.png'));
    uploadObject('assets/images/lucian.png', 'image/png', fs.readFileSync('website/assets/images/lucian.png'));
    uploadObject('assets/images/magnum.png', 'image/png', fs.readFileSync('website/assets/images/magnum.png'));
    uploadObject('assets/images/midnight.png', 'image/png', fs.readFileSync('website/assets/images/midnight.png'));
    uploadObject('assets/images/mino.png', 'image/png', fs.readFileSync('website/assets/images/mino.png'));
    uploadObject('assets/images/nightingale.png', 'image/png', fs.readFileSync('website/assets/images/nightingale.png'));
    uploadObject('assets/images/norslo.png', 'image/png', fs.readFileSync('website/assets/images/norslo.png'));
    uploadObject('assets/images/omnitrek.png', 'image/png', fs.readFileSync('website/assets/images/omnitrek.png'));
    uploadObject('assets/images/pradumo.png', 'image/png', fs.readFileSync('website/assets/images/pradumo.png'));
    uploadObject('assets/images/protheus.png', 'image/png', fs.readFileSync('website/assets/images/protheus.png'));
    uploadObject('assets/images/prythus.png', 'image/png', fs.readFileSync('website/assets/images/prythus.png'));
    uploadObject('assets/images/ragnorl.png', 'image/png', fs.readFileSync('website/assets/images/ragnorl.png'));
    uploadObject('assets/images/restula.png', 'image/png', fs.readFileSync('website/assets/images/restula.png'));
    uploadObject('assets/images/ruby.png', 'image/png', fs.readFileSync('website/assets/images/ruby.png'));
    uploadObject('assets/images/samurilio.png', 'image/png', fs.readFileSync('website/assets/images/samurilio.png'));
    uploadObject('assets/images/shadow.png', 'image/png', fs.readFileSync('website/assets/images/shadow.png'));
    uploadObject('assets/images/sheblonguh.png', 'image/png', fs.readFileSync('website/assets/images/sheblonguh.png'));
    uploadObject('assets/images/shulmi.png', 'image/png', fs.readFileSync('website/assets/images/shulmi.png'));
    uploadObject('assets/images/smolder.png', 'image/png', fs.readFileSync('website/assets/images/smolder.png'));
    uploadObject('assets/images/sonic.png', 'image/png', fs.readFileSync('website/assets/images/sonic.png'));
    uploadObject('assets/images/sprinkles.png', 'image/png', fs.readFileSync('website/assets/images/sprinkles.png'));
    uploadObject('assets/images/sukola.png', 'image/png', fs.readFileSync('website/assets/images/sukola.png'));
    uploadObject('assets/images/tagnaurak.png', 'image/png', fs.readFileSync('website/assets/images/tagnaurak.png'));
    uploadObject('assets/images/tornado.png', 'image/png', fs.readFileSync('website/assets/images/tornado.png'));
    uploadObject('assets/images/treklor.png', 'image/png', fs.readFileSync('website/assets/images/treklor.png'));
    uploadObject('assets/images/warcumer.png', 'image/png', fs.readFileSync('website/assets/images/warcumer.png'));
    uploadObject('assets/images/xanya.png', 'image/png', fs.readFileSync('website/assets/images/xanya.png'));
    uploadObject('assets/images/yuxo.png', 'image/png', fs.readFileSync('website/assets/images/yuxo.png'));
})();
