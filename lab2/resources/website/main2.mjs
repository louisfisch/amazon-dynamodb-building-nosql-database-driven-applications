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

import { API_ENDPOINT_URL } from './config.mjs';

import { post } from './ajax.mjs';

import {
    $dataRoleDragonInfo,
    $dataRoleDragonNameSelect,
    $dataRoleFilterType
} from './elements.mjs';

function handleFailure(error) {
    if (error.status === 405) {
        $dataRoleFilterType.text('No API to call');
    } else {
        $dataRoleFilterType.text('Failed due to CORS');
    }
}

function handleSuccess(data) {
    if (data.length === 0) {
        $dataRoleDragonInfo.attr('data-showing', 'not_showing');
        $dataRoleFilterType.text('No dragons found');
    } else {
        showDragons(data);
    }
}

function searchDragon(name = 'all') {
    const dragonName = $dataRoleDragonNameSelect.val();

    $dataRoleFilterType.text(`Searching database for a dragon called ${dragonName}`);
    $dataRoleDragonInfo.attr('data-showing', 'not_showing').html('');

    const params = {
        dragon_name: name.toLowerCase(),
    };

    post(API_ENDPOINT_URL, params, handleSuccess, handleFailure);
}

function showDragons(data) {
    // Initialize to an empty string to prevent it from starting with undefined
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const damage = data[i].damage.N || data[i].damage;
        const description = data[i].description.S || data[i].description;
        const family = data[i].family.S || data[i].family;
        const name = data[i].name.S || data[i].name;
        const protection = data[i].protection.N || data[i].protection;

        html += `
            <article data-family="${family}">
                <section data-role="card_internals">
                    <h4>${name}</h4>
                    <span data-role="damage">${damage}</span>
                    <span data-role="protection">${protection}</span>
                    <figure>
                        <img alt="This is a picture of ${name}" src="assets/images/${name}.png" width="300" height="300" />
                        <figcaption>${description}</figcaption>
                    </figure>
                </section>
            </article>
        `;
    }

    const dragonName = $dataRoleDragonNameSelect.val();

    $dataRoleDragonInfo.attr('data-showing', 'showing').append(html);
    $dataRoleFilterType.text(`Showing ${dragonName}`);
}

function submitDragonName(event) {
    event.preventDefault();

    searchDragon($dataRoleDragonNameSelect.val());
}

$(document).on('change', '[data-action="choose_dragon_by_name"]', submitDragonName);

searchDragon();
