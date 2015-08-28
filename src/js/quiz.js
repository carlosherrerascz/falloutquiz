var script = (function() {
    // Variable declarations.
    var allQuestions; 
    var theQuestion;
    var lastQuestion;
    var currentQuestion = 0;
    var theScore = 0;


    // Array containing all the answers the user has selected in the quiz. 
    var userAnswers = new Array(4);
    var cookieVal = {
        get: function (name) {
            "use strict";
            var value = document.cookie;
            var cookieStartsAt = value.indexOf(" " + name + "=");
            if (cookieStartsAt === -1) {
                cookieStartsAt = value.indexOf(name + "=");
            }
            if (cookieStartsAt === -1) {
                value = null;
            } else {
                cookieStartsAt = value.indexOf("=", cookieStartsAt) + 1;
                var cookieEndsAt = value.indexOf(";", cookieStartsAt);
                if (cookieEndsAt === -1) {
                    cookieEndsAt = value.length;
                }
                value = decodeURIComponent(value.substring(cookieStartsAt, cookieEndsAt));
            }
            return value;
        },
        set: function (name, value, path, expires) {
            "use strict";
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
    };


    // initialize JQuery Function.
    $(document).ready(function () {
        "use strict";
        // Creates object from JSON file.
        getQuestions(); 
    });


    function getQuestions() {
        "use strict";
        $.ajax({
            url: 'js/questions.json',
            dataType: 'json',
            success: function(data) {
                allQuestions = data;
                //Call function to start the quiz
                quiz();
            }
        });
        return allQuestions;
    }

    function quiz() {
        "use strict";
        // Tracks at what question the user is in right now.  
        theQuestion = allQuestions[currentQuestion];
        lastQuestion = allQuestions.length - 1;
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
                $('#info').html("You got " + theScore.toString() + " points!");
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
        });


        $('#btnSignup').click(function () {
            var signUpSucceeded = signUp();
            if (signUpSucceeded) {
                $('#userMessage').html('Yo, ' + cookieVal.get('userName') + '!');
                $('#userLoggedIn').show().animate({left: '0%'}, 400);
//                $('#userLoggedIn').fadeIn('slow');
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
                $('#userLoggedIn').show().animate({left: '0%'}, 600);
//                $('#userLoggedIn').fadeIn('slow');
                dismissUserAuth();
                buildOptions();
            } else {
                alert('Incorrect username or password. Please verify information and try again.');
            }
        });
    }


    // Function for building all the option labels for said question.
    function buildOptions() {
        // Sets current question via info ID.
        "use strict";
        $('#info').html(theQuestion.question);

        for (var currentOption = 0; currentOption < 4; currentOption++) {
            var currOption = "option" + currentOption.toString();
            $("label[for='" + currOption + "']").html($('#' + currOption)).append(theQuestion.choices[currentOption]);
        }

        // This means that if this question was answered before (as all arrays s0tart their values as undefined), check it by its ID. May be unnecessary due to 
        // JQuerychange event listener at the bottom of the script.
        if (userAnswers[currentQuestion] !== undefined) {
            var checkedOption = "#option" + userAnswers[currentQuestion].toString();
            
            var checkedRadBtn = $(checkedOption)[0];
            checkedRadBtn.checked = true;
        }

        $("[name='options']").hide().fadeIn('slow');
        $(".optionText").hide().fadeIn('slow');
        $('#info').hide().fadeIn('slow');
    }


    function evalOption() {
        "use strict";
        for (var i = 0; i < 4; i++) {
            var loopOption = "#option" + i.toString();

             var currentRadBtn = $(loopOption)[0];

            if (currentRadBtn.checked) {
                currentRadBtn.checked = false;
                userAnswers[currentQuestion] = i;
                return i;
            }
        }
        return null;
    }


    function computeResults() {
        "use strict";
        for (var i = 0; i <= 3; i++) {
            if (userAnswers[i] === allQuestions[i].correctAnswer) {
                theScore++;
            }
        }
    }


    function signUp() {
        "use strict";
        var userName = $('#txtUserName').val();
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
 })();

