let input = document.getElementById("getval");
document.querySelector(".bgimg button").addEventListener('click', () => {
	localStorage.setItem("bgimg", input.value);
	if (document.querySelector(".bgimg input").value = "") localStorage.removeItem("bgimg");
	document.querySelector(".bgimg input").value = "";
	document.querySelector(".bgimg button").innerHTML = 'Default';
}, true);
input.addEventListener('input', () => {
	document.querySelector(".bgimg button").innerHTML = 'Confirm';
	if (document.querySelector(".bgimg input").value == "") document.querySelector(".bgimg button").innerHTML = 'Default';
}, true);