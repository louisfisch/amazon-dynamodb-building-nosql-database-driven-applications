function post(url, params, success, failure, hasCredentials = false) {
    if (hasCredentials === true) {
        params.session_id = localStorage.getItem('session_id');
        params.username = localStorage.getItem('username');
    } else {
        //
    }

    $.ajax({
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify(params),
        dataType: 'json',
        error: failure,
        success: success,
        timeout: 3000,
        type: 'POST',
        url: url,
    });
}

export { post };
