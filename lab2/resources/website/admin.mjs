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

console.log('Find any dragon on the screen and add edit button');

function cancelEditDragon() {
    const $this = $(this);

    const dragonName = $this.parent().parent().find('[data-edit_dragon]').attr('data-edit_dragon');

    // Clear all fields
    $this.parent().parent().attr('data-editing', 'not_editing');

    console.log(`Cancel all changes to ${dragonName}`);
}

function editDragon() {
    const $this = $(this);

    const dragonName = $this.attr('data-edit_dragon');

    console.log(`You wish to edit ${dragonName}`);

    $this.parent().parent().attr('data-editing', 'editing');
}

function saveEditDragon() {
    const $this = $(this);

    const dragonName = $this.parent().parent().find('[data-edit_dragon]').attr('data-edit_dragon');

    console.log(`Show working and saving, and save changes to ${dragonName}`);

    // Hide edit after the save worked
    setTimeout(() => {
        $this.parent().parent().attr('data-editing', 'not_editing');
    }, 1000 * 1);
}

function setUpEditHandlers() {
    $(document).on('click', '[data-edit_dragon]', editDragon);
    $(document).on('click', '[data-action="save"]', saveEditDragon);
    $(document).on('click', '[data-action="cancel"]', cancelEditDragon);
}

function showEditableCards() {
    const $dataRoleDragonInfo = $('[data-role="dragon_info"]');

    $dataRoleDragonInfo.attr('data-editable', 'editable');
}

(() => {
    setUpEditHandlers();
    showEditableCards();
})();
