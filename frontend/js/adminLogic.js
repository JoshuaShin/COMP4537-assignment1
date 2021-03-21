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
  xhttp.open("GET", "https://www.jsshin.com/COMP4537/labs/5/getQuestions/");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let responses = JSON.parse(this.responseText);
      console.log(responses);
      responses.forEach((question) => {
        ++questionCount;
        appendQuestionToBody(question);
      });
    }
  };
}

function loadQuestions() {
  // JSON.parse(localStorage.getItem("questions")).forEach((question) => {
  //   ++questionCount;
  //   appendQuestionToBody(question);
  // });
  getQuestionsFromDB();
}

function postQuestionsToDB(questions) {
  questions.forEach((question) => {
    const xhttp = new XMLHttpRequest();
    const url =
      "https://www.jsshin.com/COMP4537/labs/5/app/" +
      `?question="${question.q}"&answer1=${question.a1}&answer2=${question.a2}&answer3=${question.a3}&answer4=${question.a4}&answerIndex=${question.answerIndex}`;
    console.log(url);
    xhttp.open("POST", url);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
      }
    };
  });
}

function saveQuestions() {
  const questions = document.getElementsByClassName("question");
  const a1s = document.getElementsByClassName("a1");
  const a2s = document.getElementsByClassName("a2");
  const a3s = document.getElementsByClassName("a3");
  const a4s = document.getElementsByClassName("a4");

  const formattedQuestions = [];
  for (let i = 0; i < questions.length; i++) {
    formattedQuestions.push(
      new Question(
        i + 1,
        questions[i].value,
        a1s[i].value,
        a2s[i].value,
        a3s[i].value,
        a4s[i].value,
        document.querySelector(`input[name="radio-${i + 1}"]:checked`)?.value
      )
    );
  }
  console.log(formattedQuestions);
  postQuestionsToDB(formattedQuestions);
  // localStorage.setItem("questions", []);
  // localStorage.setItem("questions", JSON.stringify(formattedQuestions));
}

const onAddBtn = () => {
  saveQuestions();
  appendQuestionToBody(new Question(`${++questionCount}`));
};

const onSaveBtn = () => {
  saveQuestions();
};

const onDeleteBtn = () => {
  const questions = document.getElementsByClassName("question");
  const a1s = document.getElementsByClassName("a1");
  const a2s = document.getElementsByClassName("a2");
  const a3s = document.getElementsByClassName("a3");
  const a4s = document.getElementsByClassName("a4");

  const formattedQuestions = [];
  for (let i = 0; i < questions.length; i++) {
    formattedQuestions.push(
      new Question(
        i + 1,
        questions[i].value,
        a1s[i].value,
        a2s[i].value,
        a3s[i].value,
        a4s[i].value,
        document.querySelector(`input[name="radio-${i + 1}"]:checked`)?.value
      )
    );
  }

  formattedQuestions.pop();
  --questionCount;

  document.getElementById("admin-label").innerHTML = "";
  formattedQuestions.forEach((question) => {
    appendQuestionToBody(question);
  });
};

let questionCount = 0;
loadQuestions();
document.getElementById("questionAddBtn").onclick = onAddBtn;
document.getElementById("questionSaveBtn").onclick = onSaveBtn;
document.getElementById("questionDeleteBtn").onclick = onDeleteBtn;
