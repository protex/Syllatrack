// Require file systems and make directory "p"
var fs = require('fs');
var mkdirp = require('mkdirp');

/*
 * Function getSyllabiList
 * 
 * Description: Gets the page data for the syllabi list page
 * 
 * Returns: none
 * 
 * Params: student_id - *string* *int* - The student ID number
 *         username - *string* - The username (email) of the student
 */
function getSyllabiList ( student_id, username ) {
    // Create request to the families website
    $.get(
        'https://families.motherofdivinegrace.org/students/' + student_id + "/syllabi",
        '',
        function (data){
            // If successfull, send the data to the list creator
            createSyllabiList( data, username, student_id );
        }
    );            
}

/* 
 * Function createSyllabiList
 * 
 * Description: Extracts the syllabi links for the user and writes to a file
 * 
 * Returns: none
 * 
 * Params: data - *string* - The HTML of the syllabi list page
 *         username - *string* - The username (email) of the user
 *         student_id - *string* *int* - The student ID number
 */

function createSyllabiList ( data, username, student_id ) {
    // Check if the user directory exists
    try {
        // Query the entry
        stats = fs.lstatSync('users');    
        // Is it a directory?
        if (stats.isDirectory()) {
            // continue;
        }
    }
    catch (e) {
        // Create directory
        mkdirp('users');
        // Create JSON file
        
        // First create user table
        var _user_table = {length:0};
        // Write data to file
        fs.writeFileSync('users/users.json', JSON.stringify(_user_table, null, 4));
    }
    finally {
        console.log('ran 0');
        // Create a request that loads the users.json
        $.getJSON('../users/users.json', function(user_table){
            console.log('ran 1');
            // Create an empty array to push syllabi links
            var syllabi = [];
            // Loop through the user table to check if the student has already been created
            for ( var i in user_table ) {
                // Check if the ID in the user table matches the student id
                if ( user_table[i]['id'] == student_id ) {
                    // Check if the usernames (emails) are the same
                    if ( user_table[i]['email'] == username ) {
                        // If they are, alert the user
                        $('#not_new_user').toggleClass('hidden');
                        return false;
                    } else {
                        // If they aren't, tell the user we've updated their email
                        $('#old_user_update').toggleClass('hidden');
                        // TODO: Create function to update email
                        return false;
                    }
                }
            }
            
            // If the user is new, we need to add to the "length" object
            user_table.length = user_table.length+1;
            // Create a new array with the username and student id, add it to the user table
            user_table[student_id] = {"email": username, "id": student_id};
            // Stringify the user table, prettify as well
            user_table = JSON.stringify(user_table, null, 4);
            
            // Write over the old data
            fs.writeFile('users/users.json', user_table);
            // Create a new directory for the user
            mkdirp('users/' + student_id);
            console.log('ran');
            // Create an array with all the syllabi links
            var syllabiLinks = data.match(/\/syllabi\/([0-9]*)\/assignments/gi);

            fs.writeFile('users/' + student_id + '/syllabiList', JSON.stringify(syllabiLinks, null, 3), function(){
                // Call the create syllabi for this user
                createSyllabi(username, student_id);    
            });                      
         }).fail(function(d, t, err){
             console.log(err);
         });
     }
}

/*
 * Function creatSyllabi
 * 
 * Discription: Kick starts the downloading and modifying of the syllabus
 * 
 * Returns: none
 * 
 * Params: username - *string* - The username (email) of the user
 *         student_id - *string* *int* - The student ID number
 */
function createSyllabi ( username, student_id ) {
    // Load users syllabus list JSON
    $.getJSON('../users/' + student_id + '/syllabiList', function(syllabiList) {
        // Loop through all the syllabi and call the download function
        for ( var i in syllabiList ) {
            downloadSyllabus(syllabiList[i], student_id);
        }   
        
        function goHome() {
            if ($.active > 0 )
                window.setTimeout(goHome, 500);
            else {
                getSyllabiNames( student_id );
                generateSyllabiListPage(student_id);
                window.location = "index.html";
            }
        }
        
        goHome();
              
    });
}

/*
 * Function downloadSyllabus
 * 
 * Descript: Downloads one syllabus
 * 
 * Returns: none
 * 
 * Params: url - *string* - The end of the URL for the syllabus
 *         username - *string* - The username (email) of the user
 */
function downloadSyllabus ( url, student_id ) {
var syllabus_id, syllabus_name;


    // Load the syllabus page
    $.get("http://families.motherofdivinegrace.org" + url, function ( data ) {
        // Extract the syllabus ID
        syllabus_id = /syllabi\/(.+?)\/assignments/g.exec(url)[1];
        // Write syllabus HTML to new file with syllabus ID as the name
        fs.writeFileSync('users/' + student_id + '/' + syllabus_id + '.html', data);
    });
    
}

/*
 * Function: getSyllabiNames
 * 
 * Desciprtion: Gets the names of all saved syllabi for a specific user
 * 
 * Returns: none
 * 
 * Params: student_id - *string* - The id of the user
 * 
 */

function getSyllabiNames ( student_id ) {
    // Load syllabi list and user file
    var syllabi = JSON.parse( fs.readFileSync('users/' + student_id + '/syllabiList').toString() ),
        users = JSON.parse( fs.readFileSync('users/users.json').toString());
        names = [],
        student_name = '';
    // Loop through the syllabi
    for (var i in syllabi) {
        // Read the coresponding HTML file and extract the name of it, then push it into an array
        names.push(
            /\<title\>(.+?)\<\/title\>/g.exec(
                fs.readFileSync(
                    'users/' + student_id + "/" + /syllabi\/(.+?)\/assignments/g.exec(
                        syllabi[i]
                    )[1] + ".html"
                ).toString()
            )[1]
        );
        // We need the users name, so we take care of this on the first run
        if ( i == 0 ) {
            // Extract the username from the HTML
            student_name = /data\-toggle\="dropdown"\>(.+?)\<b class\="caret"\>/.exec(
                fs.readFileSync(
                    'users/' + student_id + "/" + /syllabi\/(.+?)\/assignments/g.exec(
                        syllabi[i]
                    )[1] + ".html"
                ).toString()
            )[1];
            // Trim any white spaces
            student_name = student_name.trim();
            // Push students name into their user data
            users[student_id]['name'] = student_name;
        }
    }
    
    // Write that to a new file inside the users folder
    fs.writeFileSync('users/' + student_id + '/syllabiNames', JSON.stringify(names, null, 4));
    // Re write the users.json file to save the users name
    fs.writeFileSync('users/users.json', JSON.stringify(users, null, 4));  
}

/*
 * Function: generateSyllabiListPage
 * 
 * Description: Modifies syllabi_list.html for specific user
 * 
 * Params: student_id - *string* - The ID of the Student
 * 
 * Returns: none
 * 
 */

function generateSyllabiListPage ( student_id ) {
    var users, userData, syllabiListHTML;
    
    // Load user hash
    users = JSON.parse( fs.readFileSync('users/users.json').toString());
    // Set to users data
    userData = users[student_id];
    // Load HTML
    syllabiListHTML = fs.readFileSync('pages/syllabi_list.html').toString();
    // Replace constants
    syllabiListHTML = syllabiListHTML.replace('{user_id}', userData['id']).replace('{username}', userData['name']);
    // Write to new syllabi.html and save in users folder
    fs.writeFileSync('users/' + userData['id'] + '/syllabi.html', syllabiListHTML);
    
}
