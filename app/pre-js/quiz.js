var currentQuestion = 0;
var theForm = document.questions;
var theScore = 0;

// Array containing all the answers the user has selected in the quiz. 
var userAnswers = new Array(4);


//Question objects for Quiz JS. 
var allQuestions = [
    {
        question: "Which vault do you start in?",
        choices: ["Vault 87", "Vault 112", "Vault 101", "Vault 106"],
        correctAnswer: 2
     },
    {
        question: "What is the name of the leader of the Tunnel Snakes?",
        choices: ["Wally Mack", "Butch DeLoria", "Paul Hannon", "Freddie Gomez"],
        correctAnswer: 1
    },
    {
        question: "What is the sheriff of Megaton called?",
        choices: ["Lucas Simms", "Leo Stahl", "Colin Moriarty", "Harden Simms"],
        correctAnswer: 0
    },
    {
        question: "What is the name of the officer that helps you escape the Vault?",
        choices: ["Officer Hannon", "Officer Mack", "Officer Jonas", "Officer Gomez"],
        correctAnswer: 3
    }
];


// Tracks at what question the user is in right now.  
var theQuestion = allQuestions[currentQuestion];
var lastQuestion = allQuestions.length-1;


// initialize JQuery Function.
$(document).ready(function () {
    var introText = $('#info').html();

    // Brief JQuery Animation where a user authentication window slides from the bottom of the page.
    $('#userAuth').animate({top: '50%'}, 600);

    


    $('#btnNext').click(function () {
        // If the person presses the button before the last question, 
        // this block of code executes.
        if (currentQuestion < lastQuestion) {
            
            var myAnswer = evalOption();
            // If the person selected an answer, it is added,
            // currentQuestion is incremented and buildOptions is executed.
            if (myAnswer !== null) {
                currentQuestion++;
                theQuestion = allQuestions[currentQuestion];
                buildOptions();
            }
        } else if (currentQuestion === lastQuestion) {
            var myAnswer = evalOption();
            if (myAnswer !== null) {
                computeResults();

                $('#questions').animate({ left: '-100%'}, 600).promise().done(function() {
                    $('#btnBack').fadeOut('fast');
                    $('#btnNext').fadeOut('fast');
                    $('#btnReset').fadeIn('slow');
                });
            }
            $('#info').html("You got " + theScore.toString() + " points!")



        } else {
            alert("Please select an option!");
        }
    });


    $('#btnBack').click(function () {
        if (currentQuestion > 0) {
            evalOption();
            currentQuestion--;
            theQuestion = allQuestions[currentQuestion];
            buildOptions();
        } else {
            return;
        }
    });

    $('#btnReset').click(function() {
        currentQuestion = 0;
        theQuestion = allQuestions[currentQuestion];
        resetFromFinished();
        buildOptions();
    })


    $('#btnSignup').click(function () {
        var signUpSucceeded = signUp();
        if (signUpSucceeded) {
            $('#userMessage').html('Yo, ' + cookieVal.get('userName') + '!');
            $('#userLoggedIn').fadeIn('slow');
            dismissUserAuth();
            buildOptions();
        } else {
            alert("Please fill in the information!");
        }
    });


    $('#btnSignin').click(function () {
        var signInSucceeded = signIn();
        if (signInSucceeded) {
            $('#userMessage').html('Glad to see ya again, ' + cookieVal.get('userName') + '!');
            $('#userLoggedIn').fadeIn('slow');
            dismissUserAuth();
            buildOptions();
        } else {
            alert('Incorrect username or password. Please verify information and try again.');
        }
    });

});

// Function for building all the option labels for said question.
function buildOptions() {
    // Sets current question via info ID.
    $('#info').html(theQuestion.question);

    for (var currentOption = 0; currentOption < 4; currentOption++) {


        var currOption = "option" + currentOption.toString();
        $("label[for='" + currOption + "']").html($('#' + currOption)).append(theQuestion.choices[currentOption]);
    }

    // This means that if this question was answered before (as all arrays s0tart their values as undefined), check it by its ID. May be unnecessary due to 
    // JQuerychange event listener at the bottom of the script.
    if (userAnswers[currentQuestion] !== undefined) {
        var checkedOption = "option" + userAnswers[currentQuestion].toString();
        var checkedRadBtn = document.getElementById(checkedOption);
        checkedRadBtn.checked = true;
    }

    $("[name='options']").hide().fadeIn('slow');
    $(".optionText").hide().fadeIn('slow');
    $('#info').hide().fadeIn('slow');
}


function evalOption() {
    for (var i = 0; i < 4; i++) {
        var loopOption = "option" + i.toString();

        var currentRadBtn = document.getElementById(loopOption);
        //        var currentRadBtn = $(loopOption)[i];

        if (currentRadBtn.checked) {
            currentRadBtn.checked = false;
            userAnswers[currentQuestion] = i;
            return i;
        }
    }
    return null;
}


function computeResults() {
    for (var i = 0; i <= 3; i++) {
        if (userAnswers[i] === allQuestions[i].correctAnswer) {
            theScore++;
        }
    }
}


var cookieVal = {
    get: function (name) {
        var value = document.cookie;
        var cookieStartsAt = value.indexOf(" " + name + "=");
        if (cookieStartsAt == -1) {
            cookieStartsAt = value.indexOf(name + "=");
        }
        if (cookieStartsAt == -1) {
            value = null;
        } else {
            cookieStartsAt = value.indexOf("=", cookieStartsAt) + 1;
            var cookieEndsAt = value.indexOf(";", cookieStartsAt);
            if (cookieEndsAt == -1) {
                cookieEndsAt = value.length;
            }
            value = decodeURIComponent(value.substring(cookieStartsAt, cookieEndsAt));
        }
        return value;
    },
    set: function (name, value, path, expires) {
        value = encodeURIComponent(value);
        if (!expires) {
            var now = new Date();
            now.setMonth(now.getMonth() + 6);
            expires = now.toUTCString();
        }
        if (path) {
            path = ";Path=" + path;
        }
        document.cookie = name + "=" + value + ";expires = " + expires + path;

    }
}


function signUp() {
    var userName = $('#txtUserName').val()
    var password = $('#txtPassword').val();
    if (userName === "" || password === "") {
        return false;
    } else {
        localStorage.setItem("userName", userName);
        localStorage.setItem("password", password);
        var localUser = localStorage.getItem('userName');

        cookieVal.set("userName", localUser);
        return true;
    }
}


function signIn() {
    var userName = $('#txtUserName').val();
    var password = $('#txtPassword').val();

    var obtainedUserName = localStorage.getItem('userName');
    var obtainedPass = localStorage.getItem('password');

    if (userName !== obtainedUserName || password !== obtainedPass) {
        return false;
    } else {
        return true;
    }
}


function dismissUserAuth() {
    $('#userAuth').animate({ top: '150%' }, 600).promise().done(function() {
        $('#userAuth').hide();
    });

    $('#questions').stop().animate({
        right: '1.9%'
    }, 600);

    $('#btnNext').show().fadeIn('slow');
    $('#btnBack').show().fadeIn('slow');
}

function resetFromFinished() {
    for (var i=0; i<=lastQuestion; i++) {
        userAnswers[i] = undefined;
    }
    $('#btnReset').fadeOut('fast');
    $('#btnNext').fadeIn('fast');
    $('#btnBack').fadeIn('fast');
    $('#questions').stop().animate({
        left: '1.9%'
    }, 600);
}