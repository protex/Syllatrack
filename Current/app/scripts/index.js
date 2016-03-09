// Loads the user JSON file and checks if there are any users
$.getJSON('../users/users.json', function(data){
    if ( data.length > 0 ) {
        $('#access').toggleClass('hidden');
    }
});

