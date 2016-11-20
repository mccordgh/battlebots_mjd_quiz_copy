"use strict";

let roundCounter = 0,
		p1MaxHP = 666,
		p2MaxHP = 666,
		loc = window.location.pathname;

const CURRENT_DIRECTORY = loc.substring(0, loc.lastIndexOf('/'));

//import Robots object, and jquery
let Robots = require('./Robot.js'),
		$ = require('jquery'),

//create player1 and 2
Player1 = new Robots.Player(),
Player2 = new Robots.Player();

//initial function run when document is ready
$(function(){
	initEvents();
	$('#txtP1Name').focus();
});

//when press start is clicked, sets up the arena,  hides character select, and then displays it
function arenaSetup(){
	Player1.setName($('#txtP1Name').val());
	Player2.setName($('#txtP2Name').val());
	Player2.setType($('#p2Select').val());

	$('#Player1NameLi').html(`<h1>${Player1.playerName}</h1>`);
	$('#Player2NameLi').html(`<h1>${Player2.playerName}</h1>`);
	
	$('#player1Image').attr('src', Player1.type.url);
	$('#player2Image').attr('src', Player2.type.url);

	p1MaxHP = Player1.type.health;
	p2MaxHP = Player2.type.health;
	updateHealth();

	$('#playerSetup').addClass('hidden');
	$('#startFooter').addClass('hidden');

	$('#attackBtn').click(() => {
		fight();
	});

$('#battleLog').html(`<br/><h2>~~~~~~~~~~~~~~~~~ PRESS THE <popGreen>ATTACK</popGreen> BUTTON TO BEGIN!! ~~~~~~~~~~~~~~~~~</h2>`);
	randomizeBG();
	$('#battleArena').removeClass('hidden');
}

//check if user has entered name and selected a robot type for Player 1 and Player 2
function evalUserInput(){
	if ($('#txtP1Name').val() !== "" && $('#txtP2Name').val() !== "" && $('#p1Select').val() !== null && $('#p2Select').val() !== null) {
		return true;
	} else {
		return false;
	}
}

//Calls the function to execute one round of attacking for each Player, then checks if any Player dropped below 0
function fight(){
	roundCounter++;
	attacks(Player1, Player2);
	updateHealth();
	let winnerStr = "",
			winner = "",
			loser = "";

	if (Player1.type.health < 1 && Player2.type.health < 1){
		winnerStr = `<h1>DRAW!!</h1><h1><pop>${Player1.playerName}</pop> and <pop>${Player2.playerName}</pop> have both been <popGreen>defeated</popGreen>!!`;
		loser = 'both';
		winner = 'none';
	} else if (Player1.type.health < 1 && Player2.type.health > 0){
		loser = "player1";
		winner = "player2";
		winnerStr = `<h1>VICTORY!!</h1><h1><pop>${Player2.playerName}</pop> has defeated <pop>${Player1.playerName}</pop> with <popGreen>${Player2.type.skill}</popGreen>!!</h1>`;
	} else if (Player2.type.health < 1 && Player1.type.health > 0){
		winnerStr = `<h1>VICTORY!!</h1><h1><pop>${Player1.playerName}</pop> has defeated <pop>${Player2.playerName}</pop> with <popGreen>${Player1.type.skill}</popGreen>!!</h1>`;
		loser = "player2";
		winner = "player1";
	}

	if (winnerStr !== ""){
		declareWinner(winnerStr, loser, winner);
	}
}

//Places a random background image in to battle arena
function randomizeBG(){
	console.log("loc", loc);
	console.log("CURRENT_DIRECTORY", CURRENT_DIRECTORY);
	let rndBG = Math.floor(Math.random() * 6) + 1;
	let rndBGstr = `${CURRENT_DIRECTORY}/res/backgrounds/mkbg${rndBG}.jpg`;
	$('body').css('background-image', `url('${rndBGstr}')`);	
}
	
//executes a round of attacking for each player
function attacks(_attacker, _defender){
	let dmg1 = Math.floor(Math.random() * (_attacker.type.highDamage - _attacker.type.lowDamage + 1)) + _attacker.type.lowDamage;
	_defender.type.health -= dmg1;
	let dmg2 = Math.floor(Math.random() * (_defender.type.highDamage - _defender.type.lowDamage + 1)) + _defender.type.lowDamage;
	_attacker.type.health -= dmg1;
	
	$('#battleLog').html(`<br/>
		<h2>~~~~~~~~~~~~~~~~~ ROUND ${roundCounter} ~~~~~~~~~~~~~~~~~</h2>
		<br/>
		<h2><pop>${_defender.playerName}</pop> attacks <pop>${_attacker.playerName}</pop> with <pop>${_defender.type.skill}</pop> for <popGreen>${dmg1}</popGreen> damage!</h2>
		<br/>
		<h2><br/><pop>${_attacker.playerName}</pop> attacks <pop>${_defender.playerName}</pop> with <pop>${_attacker.type.skill}</pop> for <popGreen>${dmg2}</popGreen> damage!</h2>
		<br/>
		<h2>~~~~~~~~~~~~~~~~~ PRESS THE <popGreen>ATTACK</popGreen> BUTTON TO ATTACK AGAIN!! ~~~~~~~~~~~~~~~~~</h2>
	`);
}

//updates health totals and health bars
function updateHealth(){
	let p1Health = Player1.type.health > 0 ? Player1.type.health : 0;
	let p2Health = Player2.type.health > 0 ? Player2.type.health : 0;
	
	$('#Player1Info hp').html(` <pop>~</pop> [<popGreen>${Player1.type.name}</popGreen> unit] <pop>~</pop> ${p1Health} / ${p1MaxHP}`);
	$('#Player2Info hp').html(` <pop>~</pop> [<popGreen>${Player2.type.name}</popGreen> unit] <pop>~</pop> ${p2Health} / ${p2MaxHP}`);

	let hp1Percent = Math.ceil((p1Health * 100) / p1MaxHP);
	let hp2Percent = Math.ceil((p2Health * 100) / p2MaxHP);

	$('#Player1Health').css('width', `${hp1Percent}%`);
	$('#Player2Health').css('width', `${hp2Percent}%`);
}

//declares winner in a popup modal
function declareWinner(_winString, _losers, _winner){
	$('#battleLog').fadeToggle(500);

	fadeLosers(_losers);

	$('#myModal h2').html(`${_winString}<br/>`);
	$('#btnClose').click(() => {
		window.location.reload();
	});
	$('#myModal').css('display', 'block');
}

//initializes event listeners where needed
function initEvents(){
	$('#pressStartBtn').click(() => {
		if (evalUserInput()) {
			arenaSetup();
		} else {
			alert(('Please enter a name and choose a robot type for Player1 and Player2'));
		}
	});

	$('#p1Select').change(() => {
		Player1.setType($('#p1Select').val());
		$('#Player1Desc').html(Player1.toString());
	});

	$('#p2Select').change(() => {
		Player2.setType($('#p2Select').val());
		$('#Player2Desc').html(Player2.toString());
	});
}

//fade out the loser or losers image
function fadeLosers(_losers){	
	switch (_losers) {
	case 'player1':
		$('#player2Image').removeClass('coolBorderBro').addClass('winBorderBro');
		$('#player1Image').fadeToggle(5000);
		break;
	case 'player2':
		$('#player1Image').removeClass('coolBorderBro').addClass('winBorderBro');
		$('#player2Image').fadeToggle(5000);
		break;
	case 'both':
		$('#player1Image').fadeToggle(5000);
		$('#player2Image').fadeToggle(5000);
		break;
	}
}