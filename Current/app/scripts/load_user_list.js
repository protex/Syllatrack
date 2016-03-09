$.getJSON('../users/users.json', function ( user_table ) {
    for ( var i in user_table ) {
        if ( i != "length" ) {
            $('#user_list').append('<tr><td><a href="../users/' + user_table[i]['id'] + '/syllabi.html">' + user_table[i]['name'] + '</a></tr></td>');
        }
    }
});
