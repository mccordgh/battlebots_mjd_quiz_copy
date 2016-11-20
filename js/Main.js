"use strict";

let roundCounter = 0,
		p1MaxHP = 666,
		p2MaxHP = 666,
		interval;

let Robots = require('./Robot.js'),
		$ = require('jquery'),
		Player1 = new Robots.Player(),
		Player2 = new Robots.Player();

$(function(){

	$('#pressStartBtn').click((event) => {
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

	$('#txtP1Name').focus();
});

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
	$('#Player1Info hp').html(`${p1MaxHP} / ${p1MaxHP}`);
	$('#Player2Info hp').html(`${p2MaxHP} / ${p2MaxHP}`);
	$('#Player1Health hp').html(`${Player1.type.health} / ${p1MaxHP}`);
	$('#Player2Health hp').html(`${Player2.type.health} / ${p2MaxHP}`);

	document.body.setAttribute('background-size', 'cover');

	$('#playerSetup').addClass('hidden');
	$('#startFooter').addClass('hidden');

	$('#attackBtn').click((event) => {
		fight();
	});

$('#battleLog').html(`<br/><h2>~~~~~~~~~~~~~~~~~ PRESS THE <popGreen>ATTACK</popGreen> BUTTON TO BEGIN!! ~~~~~~~~~~~~~~~~~</h2>`);
	randomizeBG();
	$('#battleArena').removeClass('hidden');
}

function evalUserInput(){
	if ($('#txtP1Name').val() !== "" && $('#txtP2Name').val() !== "" && $('#p1Select').val() !== null && $('#p2Select').val() !== null) {
		return true;
	} else {
		return false;
	}
}

function fight(){
	roundCounter++;
	attacks(Player1, Player2);
	updateHealth();
	let winnerStr = "",
			loser = "";

	if (Player1.type.health < 1 && Player2.type.health < 1){
		winnerStr = `<h1>DRAW!!</h1><h1><pop>${Player1.playerName}</pop> and <pop>${Player2.playerName}</pop> have both been <popGreen>defeated</popGreen>!!`;
		loser = 'both';
	} else if (Player1.type.health < 1 && Player2.type.health > 0){
		loser = "player1";
		winnerStr = `<h1>VICTORY!!</h1><h1><pop>${Player2.playerName}</pop> has defeated <pop>${Player1.playerName}</pop> with <popGreen>${Player2.type.skill}</popGreen>!!</h1>`;
	} else if (Player2.type.health < 1 && Player1.type.health > 0){
		winnerStr = `<h1>VICTORY!!</h1><h1><pop>${Player1.playerName}</pop> has defeated <pop>${Player2.playerName}</pop> with <popGreen>${Player1.type.skill}</popGreen>!!</h1>`;
		loser = "player2";
	}

	if (winnerStr !== ""){
		declareWinner(winnerStr, loser);
	}

}

function randomizeBG(){
	let rndBG = Math.floor(Math.random() * 7) + 1;
	let rndBGstr = `../res/backgrounds/mkbg${rndBG}.jpg`;
	$('battleArena').css('background-image', `url('${rndBGstr}')`);	
}
	
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

function updateHealth(){
	let p1Health = Player1.type.health > 0 ? Player1.type.health : 0;
	let p2Health = Player2.type.health > 0 ? Player2.type.health : 0;
	
	$('#Player1Info hp').html(`${p1Health} / ${p1MaxHP}`);
	$('#Player2Info hp').html(`${p2Health} / ${p2MaxHP}`);

	let hp1Percent = Math.ceil((p1Health * 100) / p1MaxHP);
	let hp2Percent = Math.ceil((p2Health * 100) / p2MaxHP);

	$('#Player1Health').css('width', `${hp1Percent}%`);
	$('#Player2Health').css('width', `${hp2Percent}%`);
}

function declareWinner(winString, loser){
	$('#battleLog').fadeToggle(500);

	switch (loser) {
		case 'player1':
			$('#player2Image').removeClass('coolBorderBro').addClass('winBorderBro');
			$('#player1Image').fadeToggle(3000);
			break;
		case 'player2':
			$('#player1Image').removeClass('coolBorderBro').addClass('winBorderBro');
			$('#player2Image').fadeToggle(3000);
			break;
		case 'both':
			$('#player1Image').fadeToggle(3000);
			$('#player2Image').fadeToggle(3000);
			break;
	}


	$('#myModal h2').html(`${winString}<br/>`);
	$('#btnClose').click((event) => {
		window.location.reload();
	});
	$('#myModal').css('display', 'block');
}