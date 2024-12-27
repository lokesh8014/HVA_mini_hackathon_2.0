
// input field
function input() {
  const name1 = document.getElementById('name1');
  const name2 = document.getElementById('name2');
  if (name1.value.trim() === '' || name2.value.trim() === '') {
    alert('Enter both player names');
  } else {
    localStorage.setItem('player1', name1.value);
    localStorage.setItem('player2', name2.value);
    window.location.href = 'category.html';
  }
}


//fetching questions function
let questionIndex = 0;
let totalQuestions = [];
let player1Score = 0;
let player2Score = 0;

async function fetchQuestions() {
    const category = document.getElementById('category_selection').value;

    if(!category){
      alert('Please select a valid category');
      return;
    }

    localStorage.setItem('selectedCategory',category);
    
    const difficulties = ['easy','medium','hard'];
    totalQuestions = [];

    try {
      for(let difficulty of difficulties){
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=${difficulty}&limit=2`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        totalQuestions = totalQuestions.concat(data); 
      }
      }

      questionIndex = 0;
      document.getElementById('categories_container').style.display = 'none';
      document.getElementById('questionsContainer').style.display = 'block';
      showQuestion();
    } catch (error) {
      alert('Error fetching questions. Please try again later.');
    }
  }

  //function to disable the category
  function disableCategory(category){
    const categoryDrop = document.getElementById('category_selection');
    if(!categoryDrop) return;

    const options = categoryDrop.getElementsByTagName('option');
    for(let option of options){
      if(option.value === category){
        option.remove();
        break;
      }
    }
  }

//Questions Element field
function showQuestion(){
  
  if(questionIndex >= totalQuestions.length){
    document.getElementById('continue-or-endgame').style.display = 'block';
    document.getElementById('questionsContainer').style.display = 'none';
    return;
  }
  
  const question = totalQuestions[questionIndex];
  const questionText = question.question.text;
  const currentLevel = question.difficulty;

  if(questionIndex % 2 === 0){
    currentPlayer = localStorage.getItem('player1');
    oppositePlayer = localStorage.getItem('player2');
  }
  
  if(questionIndex % 2 !== 0){
    currentPlayer = localStorage.getItem('player2');
    oppositePlayer = localStorage.getItem('player1');
  }
  
  document.getElementById('head').innerHTML = `${currentPlayer} ⚔️ ${oppositePlayer}`
  document.getElementById('level').innerHTML = `Level: ${currentLevel}`;
  document.getElementById('question').innerHTML = `${currentPlayer}'s turn <br><br> ${questionText}`;
  

  const result = document.getElementById('result');
  result.innerHTML = `${localStorage.getItem('player1')}: ${player1Score} points | ${localStorage.getItem('player2')}: ${player2Score} points`;
  
  const answerButtons = document.getElementById('answer-buttons');
  answerButtons.innerHTML = '';

  const options = question.incorrectAnswers.concat(question.correctAnswer);
  options.sort(function() {
    return Math.random() - 0.5;
  });

  options.forEach(option =>{
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('btn2');
    button.onclick = () => {
      evaluateAnswer(question, button, option);
      questionIndex++;
    };
    answerButtons.appendChild(button);
  });
}

//function to evaluate answers
function evaluateAnswer(question, button, selectedOption){

  const isCorrect = selectedOption === question.correctAnswer;
  button.style.backgroundColor = isCorrect ? 'green' : 'red';

  setTimeout(() => {
    if (isCorrect) {
      button.style.backgroundColor = 'green';
    }
    else{
      button.style.backgroundColor = 'red';
    }
    showQuestion();
  }, 1000);

  if(isCorrect){
    if(question.difficulty === 'easy'){
      score = 10;
    }
    if(question.difficulty === 'medium'){
      score = 15;
    }
    if(question.difficulty === 'hard'){
      score = 20;
    }

    if (questionIndex % 2 === 0){
      player1Score += score;
    }
    if(questionIndex % 2 !==0) {
      player2Score += score;
    }
  }

  const result = document.getElementById('result');
  result.innerHTML = `${localStorage.getItem('player1')}: ${player1Score} points | ${localStorage.getItem('player2')}: ${player2Score} points`;
}

//function to continue game
function continueGame(){
  const category = document.getElementById('category_selection').value;
  disableCategory(category);
  document.getElementById('questionsContainer').style.display = 'none';
  document.getElementById('categories_container').style.display = 'block';
  document.getElementById('continue-or-endgame').style.display = 'none';
}

//function to end game
function endGame(){
  const player1 = localStorage.getItem('player1');
  const player2 = localStorage.getItem('player2');

  document.getElementById('player1-final-score').textContent = `${player1}: ${player1Score} points`;
  document.getElementById('player2-final-score').textContent = `${player2}: ${player2Score} points`;

  let winner;
  if(player1Score > player2Score){
    winner = `${player1} won the game 🤩`;
  }else if (player2Score > player1Score){
    winner = `${player2} won the game 🤩`;
  }
  else{
    winner = "It is a draw!";
  }
  document.getElementById('winner').textContent = winner;

  document.getElementById('final-score').style.display = 'block';
  document.getElementById('questionsContainer').style.display = 'none';
  document.getElementById('continue-or-endgame').style.display = 'none';
}
