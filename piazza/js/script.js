(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPanel = document.getElementById('left-pane');

    // button and input elements
    /* Task 3 : Display form in the right pane when button is clicked. */
    var buttons = document.getElementById('interactors');
    var button = buttons.getElementsByClassName('btn'); 
    button[0].addEventListener("click", function(event) { 
        event.preventDefault(); 
        rightPane.innerHTML = templates.renderQuestionForm(); 
        addQuestion(); 
    });

    // current question being viewed in the right pane. 
    var currentQuestion; 

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionTemplate = document.getElementById('questions-template');
    var expandedTemplate = document.getElementById('expanded-question-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestion: Handlebars.compile(questionTemplate.innerHTML),
        renderQuestionExpanded: Handlebars.compile(expandedTemplate.innerHTML) 
    };

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }
        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // display question list initially (if there are existing questions)
    leftPanel.innerHTML = templates.renderQuestion({
        questions: getStoredQuestions()
    });

    /* Task 1 : Allow users to post their questions to the 
     * left panel. 
     */
    function addQuestion () {
        var questionDiv = document.getElementById('question-form')
        var questionForm = questionDiv.querySelector('input[type="submit"]'); 
        questionForm.addEventListener("click", function(event) {
            event.preventDefault(); 
            var question = questionDiv.querySelector('textarea[name="question"]'); 
            var subject = questionDiv.querySelector('input[name="subject"]'); 
            var questionsArray = getStoredQuestions();
            // push submitted question to an array with no responses. 
            questionsArray.push({
                subject: subject.value, 
                question: question.value,
                responses: JSON.stringify([])
            });
            var finalHTML = templates.renderQuestion({
                questions: questionsArray
            });
            // reset panel to have blank values. 
            subject.value = ""; 
            question.value = ""; 
            storeQuestions(questionsArray);
            leftPanel.innerHTML = finalHTML;
        });
    }

    // load page with listener attached. 
    addQuestion(); 

    /* Task 2 : Adding event listeners to questions on the
     * left panel using event delegation. 
     */    
    leftPanel.addEventListener('click', function(event) {
        var target = event.target;
        while (target && target.nodeName !== "DIV") {
            target = target.parentNode;
        }
        if (target) {
            console.log(target.textContent); 
            var previousQuestions = getStoredQuestions(); 
            var obj = target; 
            // retrieve question that matches the target question clicked. 
            var inQuestion = previousQuestions.filter(function (questionQuery, index) {
                return (obj.textContent.indexOf(questionQuery.question) !== -1 && questionQuery.question !== ""); 
            });
            console.log(inQuestion); 
            // load retrieved question into the right pane
            rightPane.innerHTML = templates.renderQuestionExpanded({
                subject: inQuestion[0].subject,
                question: inQuestion[0].question,
                responses: JSON.parse(inQuestion[0].responses)
            });
            // store current question in view 
            currentQuestion = inQuestion[0]; 
        }
    });

    // Attach event listener to the right pane for whenever an expanded question is in view  
    rightPane.addEventListener('click', function(event) {
        var target = event.target;
        var anchorTarget = event.target;
        while (target && target.nodeName !== "INPUT") {
            target = target.parentNode;
        }
        if (target) {
            // if submit button is clicked and NOT on the question form page, generate responses
            if(target.classList == "btn" && this.textContent.indexOf("Welcome to Callback Piazza") == -1) {
                event.preventDefault(); 
                generateResponses(this.querySelector('p').textContent); 
            }
        } else { 
            // search page again to check if resolve button is clicked 
            while (anchorTarget && anchorTarget.nodeName !== "A") {
                anchorTarget = anchorTarget.parentNode;
            }
            if (anchorTarget) {
                event.preventDefault(); 
                // delete question being viewed on current page 
                deleteQuestion(this.querySelector('p').textContent); 
            }
        }
    });

    /* Task 5 : Remove the question from the question list and 
     * render a blank question form on the right. 
     *
     * Arguments:
     * question -- the question being resolved 
     */
    function deleteQuestion(question) { 
        var previousQuestions = getStoredQuestions(); 
        var inQuestion = previousQuestions.filter(function (questionQuery, index) {
            return question.indexOf(questionQuery.question) !== -1; 
        });
        // delete retrieved question from local storage
        previousQuestions.forEach(function (question, index) {
            if(question.question == inQuestion[0].question) {
                previousQuestions.splice(index, 1);   
            }
        });
        // rerender page with removed responses 
        storeQuestions(previousQuestions); 
        rightPane.innerHTML = templates.renderQuestionForm(); 
        leftPanel.innerHTML = templates.renderQuestion({
            questions: previousQuestions
        })
        // add listener
        addQuestion(); 
    }

    /* Task 4 : Submit response to the array of responses and load the 
     * question into right pane. This will also store the response to 
     * the local storage.  
     *
     * Arguments:
     * question -- the question being solved  
     */
    function generateResponses(question) { 
        var previousQuestions = getStoredQuestions(); 
        var inQuestion = previousQuestions.filter(function (questionQuery, index) {
            return question.indexOf(questionQuery.question) !== -1; 
        });
        console.log(inQuestion); 
        var responseName = document.querySelector('input[name="name"]'); 
        var responseBody = document.querySelector('textarea[name="response"]'); 
        var responsesArray = JSON.parse(inQuestion[0].responses); 
        // load old responses and push new respones in 
        responsesArray.push({
            name: responseName.value,
            response: responseBody.value
        }); 
        // remove old version of question and load with new version with responses 
        previousQuestions.forEach(function (question, index) {
            if(question.question == inQuestion[0].question) {
                previousQuestions.splice(index, 1);   
            }
        });
        previousQuestions.push({
            subject: inQuestion[0].subject,
            question: inQuestion[0].question,
            responses: JSON.stringify(responsesArray)
        })
        storeQuestions(previousQuestions); 
        rightPane.innerHTML = templates.renderQuestionExpanded({
            subject: inQuestion[0].subject,
            question: inQuestion[0].question,
            responses: responsesArray
        });
        // clear responses 
        responseName.value = ""; 
        responseBody.value = ""; 
    }

    /* Extentsion : Allow user to search through the questions by 
     * question content.   
     */
    var searchBar = document.getElementById("search"); 
    console.log(searchBar); 
    searchBar.addEventListener("input", function(event) {
        var previousQuestions = getStoredQuestions(); 
        var inQuestion = previousQuestions.filter(function (questionQuery, index) {
            return questionQuery.question.indexOf(searchBar.value) !== -1; 
        });
        if(inQuestion) {  
            leftPanel.innerHTML = templates.renderQuestion({
                questions: inQuestion
            }) 
            // ensure the current question being viewed has not been filtered out 
            var query = inQuestion.filter(function (questionQuery, index) {
                return questionQuery.question.indexOf(searchBar.value) !== -1; 
            });
            if(query.length == 0) {
                rightPane.innerHTML = templates.renderQuestionForm({}); 
            }
        }
    }); 

})(this, this.document);


