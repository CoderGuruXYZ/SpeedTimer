var sessions = JSON.parse(localStorage.getItem("speedtimer"));

let plus2col = 'orange';
let dnfcol = 'red';

currentSessionIdx = parseInt(JSON.parse(localStorage.getItem("cur")));

if(currentSessionIdx > sessions.length)
{
	currentSessionIdx = 0;
	localStorage.setItem("cur", JSON.stringify(currentSessionIdx));

	loadInfo();
}

document.querySelector(".scrambleDrop").value = sessions[currentSessionIdx].type;

function generateTimes() {
	var container = document.querySelector(".solves");

	container.innerHTML = "";

	for (i = 0; i < sessions[parseInt(currentSessionIdx)].times.length; i++) {
		var solveBar = document.createElement("div");
		solveBar.id = sessions[currentSessionIdx].times.length - i - 1;
		solveBar.classList.add("solveBar");

		var begin = document.createElement("div");
		begin.classList.add("begin");

		var index = document.createElement("div");
		index.classList.add("index");
		index.innerHTML = (sessions[currentSessionIdx].times.length - i).toString() + ".&nbsp;";

		var time = document.createElement("div");
		time.classList.add("time");
		if (sessions[currentSessionIdx].times[i].slice(-1) == "+") {
			time.style.color = plus2col;
			time.innerHTML = sessions[currentSessionIdx].times[i].slice(0, 2) + ":" + sessions[currentSessionIdx].times[i].slice(2, 4) + "." + sessions[currentSessionIdx].times[i].slice(4, 6) + "+";
		} else if (sessions[currentSessionIdx].times[i].slice(0, 3) == "DNF") {
			time.style.color = dnfcol;
			time.innerHTML = "DNF(" + sessions[currentSessionIdx].times[i].slice(4, 6) + ":" + sessions[currentSessionIdx].times[i].slice(6, 8) + "." + sessions[currentSessionIdx].times[i].slice(8, 10) + ")";
		} else {
			time.innerHTML = sessions[currentSessionIdx].times[i].slice(0, 2) + ":" + sessions[currentSessionIdx].times[i].slice(2, 4) + "." + sessions[currentSessionIdx].times[i].slice(4, 6);
		}

		begin.appendChild(index);
		begin.appendChild(time);

		var icons = document.createElement("div");
		icons.classList.add("icons");

		var del = document.createElement("div");
		del.classList.add("del");
		del.innerHTML = "X";
		del.addEventListener("click", deleteSolve);

		var exInfo = document.createElement("div");
		exInfo.classList.add("exInfo");
		exInfo.innerHTML = "...";
		exInfo.addEventListener("click", showScram);

		icons.appendChild(del);
		icons.appendChild(exInfo);

		solveBar.appendChild(begin);
		solveBar.appendChild(icons);

		container.appendChild(solveBar);
	}

	loadInfo();
}

function generateStats() {
	var best = document.querySelector(".bestTime");
	var avg = document.getElementById("avg");
	var worst = document.getElementById("worst");
	var ao5 = document.getElementById("ao5");
	var ao12 = document.getElementById("ao12");
	var ao100 = document.getElementById("ao100");
	var range = document.getElementById("range");

	Array.min = function (array) {
		return Math.min.apply(Math, array);
	};

	Array.max = function (array) {
		return Math.max.apply(Math, array);
	};

	//Default

	if (sessions[currentSessionIdx].times.length == 0) {
		best.innerHTML = "-";
		avg.innerHTML = "-";
		worst.innerHTML = "-";
		ao5.innerHTML = "-";
		ao12.innerHTML = "-";
		ao100.innerHTML = "-";
		range.innerHTML = "-";
	} else {

		// Best

		best.innerHTML = format(Array.min(sessions[currentSessionIdx].times));

		// Avg

		var total = 0;
		var avgTemp = 0;
		for (i = 0; i < sessions[currentSessionIdx].times.length; i++) {
			total += parseInt(sessions[currentSessionIdx].times[i]);
		}
		avgTemp = Math.round(total / sessions[currentSessionIdx].times.length);

		avg.innerHTML = format(avgTemp);

		// Worst

		worst.innerHTML = format(Math.max.apply(Math, sessions[currentSessionIdx].times))

		// Range

		if (sessions[currentSessionIdx].times.length >= 2) {
			var temp = sessions[currentSessionIdx].times;

			avgTemp = Math.max.apply(Math, temp) - Array.min(temp);

			range.innerHTML = format(avgTemp);
		} else {
			ao5.innerHTML = "-";
			ao12.innerHTML = "-";
			ao100.innerHTML = "-";
			range.innerHTML = "-";
		}

		// ao5

		if (sessions[currentSessionIdx].times.length >= 5) {
			// var temp = sessions[currentSessionIdx].times.sort(function (a, b) {
			//     return a - b
			// });

			// var total = 0;
			// var avgTemp = 0;
			// for (i = 0; i < 5; i++) {
			//     total += parseInt(temp[i]);
			// }

			// total -= Array.min(temp);
			// total -= Array.max(temp);
			// avgTemp = Math.round(total / 3);

			// ao5.innerHTML = format(avgTemp);

			var temp = sessions[currentSessionIdx].times;

			var duTemp = temp.slice(0, 5);
			console.log(duTemp)

			var total = 0;
			var avgTemp = 0;
			for (i = 0; i < 5; i++) {
				total += parseInt(duTemp[i]);
			}

			total -= Array.min(duTemp);
			total -= Array.max(duTemp);
			avgTemp = Math.round(total / 3);

			ao5.innerHTML = format(avgTemp);
		} else {
			ao5.innerHTML = "-";
			ao12.innerHTML = "-";
			ao100.innerHTML = "-";
		}

		// ao12

		if (sessions[currentSessionIdx].times.length >= 12) {
			var temp = sessions[currentSessionIdx].times;

			var duTemp = temp.slice(0, 12);
			console.log(duTemp)

			var total = 0;
			var avgTemp = 0;
			for (i = 0; i < 12; i++) {
				total += parseInt(duTemp[i]);
			}

			total -= Array.min(duTemp);
			total -= Array.max(duTemp);
			avgTemp = Math.round(total / 10);

			ao12.innerHTML = format(avgTemp);
		} else {
			ao12.innerHTML = "-";
			ao100.innerHTML = "-";
		}

		// ao100

		if (sessions[currentSessionIdx].times.length >= 100) {
			var temp = sessions[currentSessionIdx].times;

			var duTemp = temp.slice(0, 100);
			console.log(duTemp)

			var total = 0;
			var avgTemp = 0;
			for (i = 0; i < 100; i++) {
				total += parseInt(duTemp[i]);
			}

			total -= parseInt(duTemp[0]) + parseInt(duTemp[1]) + parseInt(duTemp[2]) + parseInt(duTemp[3]) + parseInt(duTemp[4]);
			total -= parseInt(duTemp[99]) + parseInt(duTemp[98]) + parseInt(duTemp[97]) + parseInt(duTemp[96]) + parseInt(duTemp[95]);
			avgTemp = Math.round(total / 90);

			ao100.innerHTML = format(avgTemp);
		} else {
			ao100.innerHTML = "-";
		}
	}
}

function deleteSolve() {
	if (confirm('Are You Sure You Want To Delete This Solve?')) {
		var uppParent1 = this.parentElement;
		var uppParent2 = uppParent1.parentElement;

		var idx = parseInt(uppParent2.id);
		idx = sessions[currentSessionIdx].times.length - idx - 1;
		sessions[currentSessionIdx].times.splice(idx, 1);
		
		localStorage.setItem("speedtimer", JSON.stringify(sessions));

		// uppParent2.style.display = "none";

		generateStats();
		generateTimes();
	}

	loadInfo();
}

function showScram() {
	var uppParent1 = this.parentElement;
	var uppParent2 = uppParent1.parentElement;

	var idx = parseInt(uppParent2.id);

	console.log(idx);

	alert(format(sessions[currentSessionIdx].times[sessions[currentSessionIdx].times.length - idx - 1]) + "\n" + sessions[currentSessionIdx].scrambles[sessions[currentSessionIdx].scrambles.length - idx - 1]);
}

function format(time) {
	var temp = time.toString();
	var temp2;

	if (temp.length == 6) {
		temp2 = temp.slice(0, 2) + ":" + temp.slice(2, 4) + "." + temp.slice(4, 6);
		return temp2;
	} else if (temp.length == 5) {
		temp2 = "0" + temp.slice(0, 1) + ":" + temp.slice(1, 3) + "." + temp.slice(3, 5);
		return temp2;
	} else if (temp.length == 4) {
		temp2 = temp.slice(0, 2) + "." + temp.slice(2, 4);
		return temp2;
	} else if (temp.length == 3) {
		temp2 = temp.slice(0, 1) + "." + temp.slice(1, 3);
		return temp2;
	} else if (temp.length == 2) {
		temp2 = "0." + temp.slice(0, 2);
		return temp2;
	} else if (temp.length == 1) {
		temp2 = "0.0" + temp.slice(0, 1);
		return temp2;
	}

	//return time;

	loadInfo();
}

function generateSessions() {
	var holder = document.querySelector(".leftSes");

	holder.innerHTML = "";

	for(i = 0; i < sessions.length; i++)
	{
		var sesBar = document.createElement("div");
		sesBar.classList.add("sesBar");
		sesBar.id = i;
		sesBar.addEventListener("click", loadAgain);

		var sesBarName = document.createElement("div");
		sesBarName.classList.add("sesBarName");
		sesBarName.innerHTML = sessions[i].name;

		sesBar.appendChild(sesBarName);

		var sesBarBtn = document.createElement("button");
		sesBarBtn.classList.add("sesBarBtn");
		sesBarBtn.id = i;
		if(i == currentSessionIdx)
		{
			sesBarBtn.classList.add("highlight");
		}
		sesBarBtn.innerHTML = "Cur";
		sesBarBtn.addEventListener("click", setCur);

		sesBar.appendChild(sesBarBtn);

		holder.appendChild(sesBar);
	}

	loadInfo();
}

function loadAgain() {
	currentSessionIdx = parseInt(this.id);

	generateTimes();
	generateStats();
	loadInfo();
}

function loadInfo() {
	var sessionName = document.getElementById("sesName");
	sessionName.value = sessions[currentSessionIdx].name;

	if(document.getElementById("sesName").value === sessions[parseInt(JSON.parse(localStorage.getItem("cur")))].name)
	{
		document.getElementById("delSes").style.display = "none";
	}
	else
	{
		document.getElementById("delSes").style.display = "flex";
	}

	if(sessions.length <= 1)
	{
		document.getElementById("delSes").style.display = "none";
	}
	else
	{
		document.getElementById("delSes").style.display = "flex";
	}

	var sessionTypeDrop = document.querySelector(".scrambleDrop");
	sessionTypeDrop.value = sessions[currentSessionIdx].type;
}

document.querySelector(".scrambleDrop").addEventListener("change", function () {
	sessions[currentSessionIdx].type = document.querySelector(".scrambleDrop").value;
	localStorage.setItem("speedtimer", JSON.stringify(sessions));
	sessions = JSON.parse(localStorage.getItem("speedtimer"));
});

document.getElementById("sesName").addEventListener("change", function () {
	sessions[currentSessionIdx].name = document.getElementById("sesName").value;
	localStorage.setItem("speedtimer", JSON.stringify(sessions));
	sessions = JSON.parse(localStorage.getItem("speedtimer"));

	generateSessions();
	loadInfo();
});

document.getElementById("delSes").addEventListener("click", function () {
	if(confirm("Are You Sure You Want to Delete This Session?"))
	{
		sessions.splice(currentSessionIdx, 1);

		localStorage.setItem("speedtimer", JSON.stringify(sessions));
		sessions = JSON.parse(localStorage.getItem("speedtimer"));

		if(currentSessionIdx > sessions.length - 1)
		{
			currentSessionIdx = 0;
		}

		localStorage.setItem("cur", JSON.stringify(currentSessionIdx));

		generateSessions();
		generateTimes();
		generateStats();
		loadInfo();
	}
});

function createSession(nameStr) {
	let sessionTemp = {
		type: "3x3",
		times: [],
		scrambles: [],
		name: nameStr
	}

	sessions.push(sessionTemp);
}

generateSessions();
generateTimes();
generateStats();
loadInfo();

document.querySelector(".newSes").addEventListener("click", function() {
	var tempName = prompt("Enter Session Name:");
	if(tempName !== null)
	{
		createSession(tempName);
		localStorage.setItem("speedtimer", JSON.stringify(sessions));
		sessions = JSON.parse(localStorage.getItem("speedtimer"));

		generateSessions();
		loadInfo();
	}
});

function setCur()
{
	currentSessionIdx = parseInt(this.id);
	localStorage.setItem("cur", JSON.stringify(currentSessionIdx));

	generateSessions();
	loadInfo();
}