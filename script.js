
let categories = [
    'music',
    'sport_and_leisure',
    'film_and_tv',
    'arts_and_literature',
    'history',
    'general_knowledge',
  ];
  let player1Score = 0;
  let player2Score = 0;
  let usedCategories = [];
  let questionIndex = 0;
  let totalQuestions = [];
  let currentCategory = '';
  
  const start = () => {
    const player1 = document.getElementById('player-1').value;
    const player2 = document.getElementById('player-2').value;
  
    if (player1 === '' || player2 === '') {
      alert("Please enter both the player's names");
      return;
    } else {
      localStorage.setItem('player1', player1);
      localStorage.setItem('player2', player2);
      window.location.href = 'category.html';
    }
  };
  
  const fetchQuestions = async () => {
    const selectedCategory = document.getElementById('categorySelect').value;
  
    if (!selectedCategory) {
      alert('Please select a unused category');
      return;
    }
  
    currentCategory = selectedCategory;
    usedCategories.push(currentCategory);
    document.getElementById('categorySelection').style.display = "none";
  
    const difficultyLevels = ['easy', 'medium', 'hard'];
    totalQuestions = [];
  
    try {
      for (const difficulty of difficultyLevels) {
        const response = await fetch(
          `https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=2&difficulties=${difficulty}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          totalQuestions = totalQuestions.concat(data);
        } else {
          alert('No questions found. Please try a different category.');
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load questions', error);
      alert('Error : fetching questions. Please try again later.');
      return;
    }
  
    questionIndex = 0;
    document.getElementById('questionsContainer').style.display = 'block';
    displayNextQuestion();
  };
  
  const displayNextQuestion = () => {
    const questionContainer = document.getElementById('questionsContainer');
    questionContainer.innerHTML = '';
  
    if (questionIndex >= totalQuestions.length) {
      document.getElementById('postQuestionOptions').style.display = 'block';
      return;
    }
  
    const questionObj = totalQuestions[questionIndex];
    const player1 = localStorage.getItem('player1');
    const player2 = localStorage.getItem('player2');
  
    const heading = document.createElement('h3');
    heading.textContent = questionIndex % 2 === 0 ? `${player1}'s turn` : `${player2}'s turn`;
    questionContainer.appendChild(heading);
  
    const questionDisplay = document.createElement('p');
    questionDisplay.textContent = questionObj.question.text;
    questionContainer.appendChild(questionDisplay);
  
    const options = [...questionObj.incorrectAnswers, questionObj.correctAnswer].sort(() => Math.random() - 0.5);
  
    options.forEach((option) => {
        const label = document.createElement('label');
        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.name = 'answer-value';
        checkboxInput.value = option;
        checkboxInput.classList.add('option-checkbox'); 
        label.appendChild(checkboxInput);
        label.appendChild(document.createTextNode(option));
        questionContainer.appendChild(label);
        questionContainer.appendChild(document.createElement('br'));
      
        
        checkboxInput.addEventListener('change', () => {
          
          const allCheckboxes = document.querySelectorAll('.option-checkbox');
          allCheckboxes.forEach((box) => {
            if (box !== checkboxInput) {
              box.checked = false; 
            }
          });
        });
      });
      
      
  
    const submitAnswer = document.createElement('button');
    submitAnswer.textContent = 'Submit';
    questionContainer.appendChild(submitAnswer);
  
    submitAnswer.addEventListener('click', () => evaluateAnswer(questionObj));
  };
  
  const evaluateAnswer = (questionObj) => {
    const attemptedAnswer = document.querySelector('input[name="answer-value"]:checked');
    const isCorrect = attemptedAnswer && attemptedAnswer.value.toLowerCase() === questionObj.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      const score = questionObj.difficulty === 'easy' ? 10 : questionObj.difficulty === 'medium' ? 15 : 20;
      questionIndex % 2 === 0 ? player1Score += score : player2Score += score;
    }
  
    questionIndex++;
    displayNextQuestion();
  };
  
  const selectAnotherCategory = () => {
    document.getElementById('questionsContainer').style.display = 'none';
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('postQuestionOptions').style.display = 'none';
  };
  
  const endGame = () => {
    const player1 = localStorage.getItem('player1');
    const player2 = localStorage.getItem('player2');
    const questionContainer = document.getElementById('questionsContainer');
    questionContainer.innerHTML = `<h1>Final Score:</h1>
                                    <p>${player1}: ${player1Score} points <br>
                                     ${player2}: ${player2Score} points</p>`;
                                    
    if (player1Score > player2Score) {
      alert(`${player1} won the Game!`);
    } else if (player2Score > player1Score) {
      alert(`${player2} won the Game!`);
    } else {
      alert("It's a tie!");
    }
    document.getElementById('postQuestionOptions').style.display = 'none';
  };
  