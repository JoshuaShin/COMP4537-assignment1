let questions = [];

function questionHTML(question) {
  return `
        <div class="questionDiv">
            <label>Question ${question.questionNumber}</label>
            <textarea class="form-control question" aria-label="With textarea" disabled>${question.q}</textarea>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" value="0">
                <input placeholder="Answer 1" type="text" class="form-control a1" value="${question.a1}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" value="1">
                <input placeholder="Answer 2" type="text" class="form-control a2" value="${question.a2}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" value="2">
                <input placeholder="Answer 3" type="text" class="form-control a3" value="${question.a3}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" value="3">
                <input placeholder="Answer 4" type="text" class="form-control a4" value="${question.a4}" disabled>
            </div>
        </div>
        `;
}

function appendQuestionToBody(question) {
  div = document.getElementById("user-label");
  div.insertAdjacentHTML("beforeend", questionHTML(question));
}

function getQuestionsFromDB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/COMP4537/labs/quiz/");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let responses = JSON.parse(this.responseText);
          console.log(responses);
          responses.forEach((question) => {
            appendQuestionToBody(question);
          });
          questions = responses;
        }
    };
}
  
function loadQuestions() {
//   const questions = JSON.parse(localStorage.getItem("questions"));
//   questions.forEach((question) => {
//     appendQuestionToBody(question);
//   });
//   return questions;
    getQuestionsFromDB();
}

const submitBtn = () => {
  let wrongCount = 0;
  let message = "";
  for (let i = 0; i < questions.length; i++) {
    if (
      document.querySelector(`input[name="radio-${questions[i].questionNumber}"]:checked`)?.value !=
      questions[i].answerIndex
    ) {
      message += `Question ${questions[i].questionNumber} is wrong.\n`;
      wrongCount++;
    }
  }
  message =
    `Score: ${questions.length - wrongCount}/${questions.length}\n` + message;
  document.getElementById("quiz-result").innerText = message;
  window.alert(message);
};

loadQuestions();
document.getElementById("submitBtn").onclick = submitBtn;
