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
    $body,
    $dataActionLogout,
    $dataRoleAttemptedPassword,
    $dataRoleDragonInfo,
    $dataRoleDragonNameSelect,
    $dataRoleEmailAddress,
    $dataRoleErrorMessage,
    $dataRoleFilterType,
} from './elements.mjs';

function cancelEditDragon() {
    const $this = $(this);
    const dragonName = $this.parent().parent().find('[data-edit_dragon]').attr('data-edit_dragon');

    // Clear all fields
    $this.parent().parent().attr('data-editing', 'not_editing');

    // Collect all changes
    console.log(`Cancel all changes for ${dragonName}`);
}

function constructEditPayload($articleDragon) {
    const currentDamage = Number($articleDragon.children('[data-original_damage]').attr('data-original_damage'));
    const currentDescription = $articleDragon.children('[data-original_description]').attr('data-original_description');
    const currentDragonName = $articleDragon.children('[data-original_dragon_name]').attr('data-original_dragon_name');
    const currentProtection = Number($articleDragon.children('[data-original_protection]').attr('data-original_protection'));

    const newDamage = Number($articleDragon.children('[data-original_damage]').val());
    const newDescription = $articleDragon.children('[data-original_description]').text();
    const newDragonName = $articleDragon.children('[data-original_dragon_name]').text();
    const newProtection = Number($articleDragon.children('[data-original_protection]').val());

    const params = {};

    params.updates = {};

    if (currentDragonName !== newDragonName) {
        params.updates.name = newDragonName;
    }

    if (currentDescription !== newDescription) {
        params.updates.description = newDescription;
    }

    if (currentDamage !== newDamage) {
        params.updates.damage = newDamage;
    }

    if (currentProtection !== newProtection) {
        params.updates.protection = newProtection;
    }

    params.username = localStorage.getItem('username');
    params.session_id = localStorage.getItem('session_id');
    params.current_name = currentDragonName;

    return params;
}

function dropDownDragonSwap(currentName, newName) {
    $dataRoleDragonNameSelect.find(`[value="${currentName}"]`).val(newName).text(newName);
}

function editDragon() {
    const $this = $(this);
    const dragonName = $this.attr('data-edit_dragon');

    console.log(`You wish to edit ${dragonName}`);

    $this.parent().parent().attr('data-editing', 'editing');
}

function hideErrorMessage() {
    $dataRoleErrorMessage.text('').attr('data-showing', 'not_showing');
}

function hideLoginScreen() {
    $('[data-role="login_screen"]').attr('data-showing', 'not_showing');
}

function showLoginScreen() {
    logout();
}

function handleSuccessfulLogin(data) {
    if (data.errorMessage) {
        return handleFailedLogin(data);
    }

    localStorage.setItem('session_id', data.session_id);
    localStorage.setItem('username', data.username);

    if (data.is_admin) {
        localStorage.setItem('isAdmin', data.is_admin.toString());

        $body.attr('data-editable', 'editable');
    } else {
        $body.removeAttr('data-editable');
    }

    searchDragon();

    showLogoutButton(localStorage.getItem('username'));

    hideLoginScreen();
}

function handleFailedLogin(data) {
    if (data.errorMessage) {
        showErrorMessage(data.errorMessage);
    } else {
        showErrorMessage('Unknown error');
    }
}

function login(emailAddress, attemptedPassword) {
    const params = {
        attempted_password: attemptedPassword,
        email_address: emailAddress,
    };

    post(`${API_ENDPOINT_URL}/login`, params, handleSuccessfulLogin, handleFailedLogin, false);
}

function logout() {
    localStorage.clear();

    location.reload();
}

function handleFailedEdit(error) {
    console.error(error, error.stack);
}

function handleFailure(error) {
    if (error.status === 405) {
        $dataRoleFilterType.text('No API to call');
    } else {
        $dataRoleFilterType.text('Failed due to CORS');
    }
}

function handleSuccess(data) {
    if (data.errorMessage === 'Invalid credentials') {
        showErrorMessage(data.errorMessage);

        setTimeout(() => showLoginScreen(), 1000 * 1.65);

        return;
    }

    const filter = $dataRoleDragonNameSelect.val();

    if (data.length === 0) {
        $dataRoleFilterType.text(`No dragon found called ${filter.toLowerCase()}`);
        $dataRoleDragonInfo.attr('data-showing', 'not_showing')
    } else {
        showDragons(data);
    }
}

function handleSuccessfulEdit(data) {
    const $this = $(this);
    const $articleDragon = $this.parent().parent().find('[data-face="back"]');
    const $other = $this.parent().parent().find('[data-face="front"]');

    if (data.damage) {
        $articleDragon.children('[data-original_damage]').attr('data-original_damage', data.damage.N.toString()).val(data.damage.N.toString());

        $other.find('[data-role="damage"]').text(data.damage.N.toString());
    }

    if (data.protection) {
        $articleDragon.children('[data-original_protection]').attr('data-original_protection', data.protection.N.toString()).val(data.protection.N.toString());

        $other.find('[data-role="protection"]').text(data.protection.N.toString());
    }

    if (data.description) {
        $articleDragon.children('[data-original_description]').attr('data-original_description', data.description.S).text(data.description.S);

        $other.find('[data-role="description"]').text(data.description.S);
    }

    if (data.name) {
        const oldName = $articleDragon.children('[data-original_dragon_name]').attr('data-original_dragon_name');

        $articleDragon.children('[data-original_dragon_name]').attr('data-original_dragon_name', data.name.S).text(data.name.S);

        $other.find('[data-edit_dragon]').attr('data-edit_dragon', data.name.S);

        $other.find('[data-role="dragon_name"]').text(data.name.S);

        // Remove from drop down
        dropDownDragonSwap(oldName, data.name.S);
    }

    $this.parent().parent().attr('data-editing', 'not_editing');
}

function saveEditDragon() {
    const $this = $(this);
    const $articleDragon = $this.parent().parent().find('[data-face="back"]');
    // const $other = $this.parent().parent().find('[data-face="front"]');

    const params = constructEditPayload($articleDragon);

    console.log(params);

    post(`${API_ENDPOINT_URL}/edit`, params, handleSuccessfulEdit, handleFailedEdit);
}

function searchDragon(name = 'all') {
    const dragonName = $dataRoleDragonNameSelect.val();

    $dataRoleFilterType.text(`Searching database for a dragon called ${dragonName}`);
    $dataRoleDragonInfo.attr('data-showing', 'not_showing').html('');

    const params = {
        dragon_name: name.toLowerCase(),
    };

    post(API_ENDPOINT_URL, params, handleSuccess, handleFailure, true);
}

function showDragons(data) {
    // Initialize to an empty string to prevent it from starting with undefined
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const damage = data[i].damage.N || data[i].damage;
        // const date = new Date(data[i].data_found.S).toLocaleDateString();
        const description = data[i].description.S || data[i].description;
        const family = data[i].family.S || data[i].family;
        const name = data[i].name.S || data[i].name;
        const protection = data[i].protection.N || data[i].protection;

        html += `
            <section data-role="card_wrapper">
                <article data-face="back">
                    <span data-action="save">
                        <i class="material-icons">save</i>
                    </span>
                    <span data-action="cancel">
                        <i class="material-icons">cancel</i>
                    </span>
                    <h3 data-original_dragon_name="${name}" contenteditable="true">${name}</h3>
                    <p data-original_description="${description}" contenteditable="true">${description}</p>
                    <label>damage</label>
                    <input data-original_damage="${damage.toString()}" type="range" min="1" max="10" value="${damage.toString()}">
                    <label>protection</label>
                    <input data-original_protection="${protection.toString()}" type="range" min="1" max="10" value="${protection.toString()}">
                </article>

                <article data-face="front" data-family="${family}">
                    <span data-edit_dragon="${name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                    </span>
                    <section data-role="card_internals">
                        <h4 data-role="dragon_name">${name}</h4>
                        <span data-role="damage">${damage.toString()}</span>
                        <span data-role="protection">${protection.toString()}</span>
                        <figure>
                            <!-- We no not change the picture the original data is hard coded to the PNGs name -->
                            <!-- In production you would trigger lambda to rename the image in Amazon S3 -->
                            <!-- As we are using a CDN for the images that we host (to save the student uploading files), we can't do this -->
                            <img alt="This is a picture of ${name}" src="assets/images/${name}.png" width="300" height="300">
                            <figcaption data-role="description">${description}</figcaption>
                        </figure>
                    </section>
                </article>
            </section>
        `;
    }

    const dragonName = $dataRoleDragonNameSelect.val();

    $dataRoleDragonInfo.attr('data-showing', 'showing').append(html);
    $dataRoleFilterType.text(`Showing ${dragonName}`);
}

function showErrorMessage(message) {
    $dataRoleErrorMessage.text(message).attr('data-showing', 'showing');
}

function showLogoutButton(username) {
    $dataActionLogout.attr('data-showing', 'showing').text(`Logout ${username}`)
}

function submitDragonName(event) {
    event.preventDefault();

    searchDragon($dataRoleDragonNameSelect.val());
}

function submitLogin(event) {
    event.preventDefault();

    hideErrorMessage();

    const attemptedPassword = $dataRoleAttemptedPassword.val();
    const emailAddress = $dataRoleEmailAddress.val();

    if (attemptedPassword && emailAddress) {
        login(emailAddress, attemptedPassword);
    } else {
        showErrorMessage('No credentials provided');
    }
}

$(document).on('change', '[data-action="choose_dragon_by_name"]', submitDragonName);
$(document).on('submit', '[data-role="login_form"]', submitLogin);
$(document).on('click', '[data-action="logout"]', logout);
$(document).on('click', '[data-edit_dragon]', editDragon);
$(document).on('click', '[data-action="save"]', saveEditDragon);
$(document).on('click', '[data-action="cancel"]', cancelEditDragon);

if (localStorage.getItem('username') !== null) {
    showLogoutButton(localStorage.getItem('username'));

    if (localStorage.getItem('isAdmin') !== null) {
        $body.attr('data-editable', 'editable');
    }

    hideLoginScreen();

    searchDragon();
}
