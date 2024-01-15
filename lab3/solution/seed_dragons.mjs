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

import { BatchWriteItemCommand, DynamoDB } from '@aws-sdk/client-dynamodb';

// Define __dirname in ES module scope
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const dynamoDbClient = new DynamoDB({
    region: 'us-east-1',
});

async function awsDynamoDbBatchWriteItem(items, tableName) {
    const responses = [];

    for (let i = 0; i < items.length; i += 25) {
        const j = Math.min(i + 25, items.length);

        const command = new BatchWriteItemCommand({
            RequestItems: {
                [tableName]: items.slice(i, j),
            },
        });

        responses.push(await dynamoDbClient.send(command));
    }

    return responses;
}

async function seedDragonBonusAttackTable() {
    const DRAGON_BONUS_ATTACK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/dragon_bonus_attack.json')));

    const dragons = [];

    for (let i = 0; i < DRAGON_BONUS_ATTACK.length; i++) {
        const dragon = {
            PutRequest: {
                Item: {
                    breath_attack: {
                        'S': DRAGON_BONUS_ATTACK[i].breath_attack,
                    },
                    description: {
                        'S': DRAGON_BONUS_ATTACK[i].description,
                    },
                    extra_damage: {
                        'S': String(DRAGON_BONUS_ATTACK[i].extra_damage),
                    },
                    range: {
                        'N': String(DRAGON_BONUS_ATTACK[i].range),
                    },
                },
            },
        };

        dragons.push(dragon);
    }

    const response = await awsDynamoDbBatchWriteItem(dragons, 'dragon_bonus_attack');

    return response;
}

async function seedDragonCurrentPowerTable() {
    const DRAGON_CURRENT_POWER = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/dragon_current_power.json')));

    const dragons = [];

    for (let i = 0; i < DRAGON_CURRENT_POWER.length; i++) {
        const dragon = {
            PutRequest: {
                Item: {
                    current_endurance: {
                        'N': String(DRAGON_CURRENT_POWER[i].current_endurance),
                    },
                    current_will_not_fight_credits: {
                        'N': String(DRAGON_CURRENT_POWER[i].current_will_not_fight_credits),
                    },
                    game_id: {
                        'S': DRAGON_CURRENT_POWER[i].game_id,
                    },
                    name: {
                        'S': DRAGON_CURRENT_POWER[i].name,
                    },
                },
            },
        };

        dragons.push(dragon);
    }

    const response = await awsDynamoDbBatchWriteItem(dragons, 'dragon_current_power');

    return response;
}

async function seedDragonFamilyTable() {
    const DRAGON_FAMILY = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/dragon_family.json')));

    const dragons = [];

    for (let i = 0; i < DRAGON_FAMILY.length; i++) {
        const dragon = {
            PutRequest: {
                Item: {
                    breath_attack: {
                        'S': DRAGON_FAMILY[i].breath_attack,
                    },
                    damage_modifier: {
                        'N': String(DRAGON_FAMILY[i].damage_modifier),
                    },
                    description: {
                        'S': DRAGON_FAMILY[i].description,
                    },
                    family: {
                        'S': DRAGON_FAMILY[i].family,
                    },
                    protection_modifier: {
                        'N': String(DRAGON_FAMILY[i].protection_modifier),
                    },
                },
            },
        };

        dragons.push(dragon);
    }

    const response = await awsDynamoDbBatchWriteItem(dragons, 'dragon_family');

    return response;
}

async function seedDragonStatsTable() {
    const DRAGON_STATS = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/dragon_stats.json')));

    const dragons = [];

    for (let i = 0; i < DRAGON_STATS.length; i++) {
        const dragon = {
            PutRequest: {
                Item: {
                    damage: {
                        'N': String(DRAGON_STATS[i].damage),
                    },
                    description: {
                        'S': DRAGON_STATS[i].description,
                    },
                    family: {
                        'S': DRAGON_STATS[i].family,
                    },
                    location_city: {
                        'S': DRAGON_STATS[i].location_city,
                    },
                    location_country: {
                        'S': DRAGON_STATS[i].location_country,
                    },
                    location_neighborhood: {
                        'S': DRAGON_STATS[i].location_neighborhood,
                    },
                    location_state: {
                        'S': DRAGON_STATS[i].location_state,
                    },
                    name: {
                        'S': DRAGON_STATS[i].name,
                    },
                    protection: {
                        'N': String(DRAGON_STATS[i].protection),
                    },
                },
            },
        };

        dragons.push(dragon);
    }

    const response = await awsDynamoDbBatchWriteItem(dragons, 'dragon_stats');

    return response;
}

(async function seedTables() {
    console.time('How fast was that?');
    Promise.allSettled([
        seedDragonBonusAttackTable(),
        seedDragonCurrentPowerTable(),
        seedDragonFamilyTable(),
        seedDragonStatsTable(),
    ]).then((values) => {
        console.log(values);
    }).catch((error) => {
        console.error(error);
    });
    console.timeEnd('How fast was that?');
})();
