// Question constructor function
function Question(text, choices, answer, hint) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
    this.hint = hint;
  }
  
  Question.prototype.isCorrectAnswer = function (choice) {
    return this.answer === choice;
  };
  
  // Quiz constructor function
  function Quiz(questions) {
    this.questions = questions;
    this.score = 0;
    this.questionIndex = 0;
  }
  
  Quiz.prototype.getQuestionIndex = function () {
    return this.questions[this.questionIndex];
  };
  
  Quiz.prototype.isEnded = function () {
    return this.questionIndex === this.questions.length;
  };
  
  Quiz.prototype.guess = function (answer) {
    if (this.getQuestionIndex().isCorrectAnswer(answer)) {
      this.score++;
    }
    this.questionIndex++;
  };
  
  // Questions array
  const questions = [
    new Question("Which Olympian has won 28 medals, more than any other person in the Games history?", ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Larisa Latynina"],"Michael Phelps","Hint: It's towards the clouds'." ),    
    new Question("Once described as “the greatest athlete of all time,” Jim Thorpe was stripped of his Olympic gold medals because he…", ["took a shortcut during a marathon", "was previously a paid athlete", "used performance-enhancing drugs", "made controversial remarks"],"was previously a paid athlete","Hint: It's a movie released in 2021.'." ),
    new Question("The United States boycotted the 1980 Olympics to protest what?", ["the Soviet Union’s invasion of Afghanistan", "the takeover of the U.S. embassy in Iran", "civil rights violations in North Korea", "apartheid in South Africa"],"the Soviet Union’s invasion of Afghanistan","Hint:It's directed by orsen welles'." ),
    new Question("Which of the following was developed for the first modern Olympic Games, held in Athens in 1896?", ["the marathon", "arm wrestling", "Pilates", "the biathlon"],"the marathon","Hint: its directed by david fincher'." ),
    new Question("After having respectively won a gold and bronze medal, Tommie Smith and John Carlos were ejected from the 1968 Mexico City Games after doing what?", ["intentionally tripping an opponent", "kneeling during their national anthem", "giving Black Power salutes", "gambling on the Games"],"giving Black Power salutes","Hint: It's towards the clouds'." ),
];
  
  const quiz = new Quiz(questions);
  
  // Populate the quiz
  function populate() {
    if (quiz.isEnded()) {
      showScores();
    } else {
      const currentQuestion = quiz.getQuestionIndex();
  
      // Render question as image or text
      const questionElement = document.getElementById("question");
      if (currentQuestion.text.endsWith(".jpg") || currentQuestion.text.endsWith(".png")) {
        questionElement.innerHTML = `<img src="${currentQuestion.text}" alt="Question Image" style="width:300px;height:auto;">`;
      } else {
        questionElement.innerHTML = currentQuestion.text;
      }
  
      // Render choices
      const choices = currentQuestion.choices;
      for (let i = 0; i < choices.length; i++) {
        const choiceElement = document.getElementById("bt" + i);
        choiceElement.innerHTML = choices[i];
        guess("bt" + i, choices[i]);
      }
  
      // Show hint button only for active questions
      const hintButton = document.getElementById("hintButton");
      if (quiz.questionIndex < quiz.questions.length) {
        hintButton.style.display = "inline-block";
      } else {
        hintButton.style.display = "none"; // Hide hint button after last question
      }
  
      // Hide hint text initially
      const hintElement = document.getElementById("hint");
      hintElement.style.display = "none";
  
      showProgress();
    }
  }
  
  // Handle user guess
  function guess(id, choice) {
    const button = document.getElementById(id);
    button.onclick = function () {
      quiz.guess(choice);
      populate();
    };
  }
  
  // Show progress
  function showProgress() {
    const currentQuestionNumber = quiz.questionIndex + 1;
    const progressElement = document.getElementById("progress");
    progressElement.innerHTML = `Question ${currentQuestionNumber} of ${quiz.questions.length}`;
  }
  
  // Show hint
  function showHint() {
    const hintElement = document.getElementById("hint");
    if (!quiz.isEnded()) {
      hintElement.innerHTML = quiz.getQuestionIndex().hint;
      hintElement.style.display = "block";
    }
  }
  
  // Display final scores
  function showScores() {
    const quizElement = document.getElementById("quiz");
    quizElement.innerHTML = `
      <h1>Score Card</h1>
      <h2 id="score">Your score: ${quiz.score}</h2>
      <p>Spin the wheel to add bonus points to your score!</p>
      <div class="wheel-container">
          <div class="wheel-of-fortune">
              <ul>
                  <li data-points="1">+1</li>
                  <li data-points="2">+2</li>
                  <li data-points="3">+3</li>
                  <li data-points="0">+0</li>
                  <li data-points="5">+5</li>
                  <li data-points="1">+1</li>
                  <li data-points="2">+2</li>
                  <li data-points="4">+4</li>
              </ul>
          </div>
          <button id="spinButton">Spin the Wheel!</button>
      </div>
    `;
  
    // Initialize the wheel functionality
    initializeWheel();
  }
  
  // Initialize the bonus spin wheel
  function initializeWheel() {
    const wheel = document.querySelector(".wheel-of-fortune");
    const spinButton = document.getElementById("spinButton");
    let isSpinning = false;
  
    spinButton.addEventListener("click", () => {
      if (isSpinning) return; // Prevent multiple spins
      isSpinning = true;
  
      const randomRotation = Math.floor(3600 + Math.random() * 360);
      wheel.style.transform = `rotate(${randomRotation}deg)`;
  
      setTimeout(() => {
        const actualRotation = randomRotation % 360;
        const sections = document.querySelectorAll(".wheel-of-fortune ul li");
        const sectionAngle = 360 / sections.length;
        const selectedIndex = Math.floor((360 - actualRotation) / sectionAngle) % sections.length;
        const points = parseInt(sections[selectedIndex].dataset.points, 10);
  
        quiz.score += points;
        document.getElementById("score").textContent = `Your score: ${quiz.score}`;
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${actualRotation}deg)`;
  
        setTimeout(() => {
          wheel.style.transition = "transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
        });
        isSpinning = false;
      }, 5000);
    });
  }
  
  // Attach hint button event listener
  document.getElementById("hintButton").onclick = showHint;
  
  // Start quiz
  populate();
  