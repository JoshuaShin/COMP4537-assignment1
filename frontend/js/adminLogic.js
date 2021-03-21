let questions = [];
let initialQuestionNumbers = new Set();

function questionHTML(question) {
  return `
        <div class="questionDiv">
            <label>Question ${question.questionNumber}</label>
            <textarea class="form-control question" aria-label="With textarea">${
              question.q
            }</textarea>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" ${
    question.answerIndex == 0 && "checked"
  } value="0">
                <input placeholder="Answer 1" type="text" class="form-control a1" value="${
                  question.a1
                }">
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" ${
    question.answerIndex == 1 && "checked"
  } value="1">
                <input placeholder="Answer 2" type="text" class="form-control a2" value="${
                  question.a2
                }">
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" ${
    question.answerIndex == 2 && "checked"
  } value="2">
                <input placeholder="Answer 3" type="text" class="form-control a3" value="${
                  question.a3
                }">
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.questionNumber}" ${
    question.answerIndex == 3 && "checked"
  } value="3">
                <input placeholder="Answer 4" type="text" class="form-control a4" value="${
                  question.a4
                }">
            </div>
        </div>
        `;
}

function appendQuestionToBody(question) {
  div = document.getElementById("admin-label");
  div.insertAdjacentHTML("beforeend", questionHTML(question));
}

function Question(questionNumber, q, a1, a2, a3, a4, answerIndex) {
  this.questionNumber = questionNumber;
  this.q = q || "";
  this.a1 = a1 || "";
  this.a2 = a2 || "";
  this.a3 = a3 || "";
  this.a4 = a4 || "";
  this.answerIndex = answerIndex;
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
        questions.push(question);
        initialQuestionNumbers.add(question.questionNumber);
        appendQuestionToBody(question);
      });
      loadedLength = questions.length;
    }
  };
}

function postQuestionsToDB() {
  questions.forEach((question) => {
    const xhttp = new XMLHttpRequest();
    if (initialQuestionNumbers.has(String(question.questionNumber))) {
      const url = "https://www.jsshin.com/COMP4537/labs/quiz/" +
      `?question="${question.q}"&answer1="${question.a1}"&answer2="${question.a2}"&answer3="${question.a3}"&answer4="${question.a4}"&answerIndex=${question.answerIndex}&id=${question.questionNumber}`;
      console.log(url);
      xhttp.open("PUT", url);
    } else {
      const url = "https://www.jsshin.com/COMP4537/labs/quiz/" +
      `?question="${question.q}"&answer1="${question.a1}"&answer2="${question.a2}"&answer3="${question.a3}"&answer4="${question.a4}"&answerIndex=${question.answerIndex}`;
      xhttp.open("POST", url);
    }
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
      }
    };
  });
}

function deleteQuestionFromDB(question) {
  const xhttp = new XMLHttpRequest();
  const url =
  "https://www.jsshin.com/COMP4537/labs/quiz/" +
  `?id=${question.questionNumber}`;
  xhttp.open("POST", url);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
}

function saveQuestions() {
  updateQuestions();
  postQuestionsToDB();
}

function updateQuestions() {
  const qs = document.getElementsByClassName("question");
  const a1s = document.getElementsByClassName("a1");
  const a2s = document.getElementsByClassName("a2");
  const a3s = document.getElementsByClassName("a3");
  const a4s = document.getElementsByClassName("a4");

  const updatedQuestions = [];
  for (let i = 0; i < qs.length; i++) {
    updatedQuestions.push(
      new Question(
        questions[i].questionNumber,
        qs[i].value,
        a1s[i].value || "",
        a2s[i].value || "",
        a3s[i].value || "",
        a4s[i].value || "",
        document.querySelector(`input[name="radio-${questions[i].questionNumber}"]:checked`)?.value || 0
      )
    );
  }
  questions = updatedQuestions;
}

const onAddBtn = () => {
  const question = new Question(questions.length + 1);
  questions.push(question);
  appendQuestionToBody(question);
};

const onSaveBtn = () => {
  saveQuestions();
};

const onDeleteBtn = () => {
  updateQuestions();

  // Update database
  const deletedQuestion = questions.pop();
  deleteQuestionFromDB(deletedQuestion);

  // Update visually
  document.getElementById("admin-label").innerHTML = "";
  let initialQuestionNumbers = new Set();
  questions.forEach((question) => {
    initialQuestionNumbers.add(question.questionNumber);
    appendQuestionToBody(question);
  });
};

getQuestionsFromDB();
document.getElementById("questionAddBtn").onclick = onAddBtn;
document.getElementById("questionSaveBtn").onclick = onSaveBtn;
document.getElementById("questionDeleteBtn").onclick = onDeleteBtn;
