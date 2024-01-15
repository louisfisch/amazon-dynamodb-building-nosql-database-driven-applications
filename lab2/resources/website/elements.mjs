/*
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

const $body = $('body');

const $dataActionLogout = $('[data-action="logout"]');

const $dataRoleAttemptedPassword = $('[data-role="attempted_password"]');

const $dataRoleDragonInfo = $('[data-role="dragon_info"]');

const $dataRoleDragonNameSelect = $('[data-role="dragon_name_select"]');

const $dataRoleEmailAddress = $('[data-role="email_address"]');

const $dataRoleErrorMessage = $('[data-role="error_message"]');

const $dataRoleFilterType = $('[data-role="filter_type"]');

export {
    $body,
    $dataActionLogout,
    $dataRoleAttemptedPassword,
    $dataRoleDragonInfo,
    $dataRoleDragonNameSelect,
    $dataRoleEmailAddress,
    $dataRoleErrorMessage,
    $dataRoleFilterType,
}
