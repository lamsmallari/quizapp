const loader = document.getElementById("loader");
const main = document.querySelector(".main");

let clientToken = window.localStorage.getItem("client_token");

async function createToken() {
  const newToken = await fetch("https://opentdb.com/api_token.php?command=request");
  const newTokenData = await newToken.json();

  clientToken = newTokenData.token;
  window.localStorage.setItem("client_token", newTokenData.token);
}

async function checkToken() {
  const currentToken = await fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&token=" + clientToken);
  const currentTokenData = await currentToken.json();
  
  const responseCode = currentTokenData.response_code;
  console.log("response : " + responseCode);

  // (3) expired or (0) not found, request new one
  if (responseCode === 3 || responseCode === 2) {
    createToken();
  }

  // (4) reset token if all question are answered
  if (responseCode == 4) {
    const currentToken = await fetch("https://opentdb.com/api_token.php?command=reset&token=" + clientToken);
  }

  main.classList.remove('hidden');
  loader.classList.add('hidden');
}

checkToken();