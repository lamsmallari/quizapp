const MAX_HIGH_SCORES = 5;
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');

// get recent quiz result score
const mostRecentScore = localStorage.getItem('mostRecentScore');

// JSON.parse = convert a 'array string' to an actual array
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// print recent quiz result score
finalScore.innerText = mostRecentScore;

// username field validator
username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
})

saveHighScore = e => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value
  };

  highScores.push(score);
  highScores.sort( (a,b) => b.score - a.score );
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign("/");
}