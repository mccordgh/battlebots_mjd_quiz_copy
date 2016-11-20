"use strict";

let RobotModels = require('./RobotModels.js');

let BattleBots = {};

BattleBots.Player = function(name) {

  this.toString = function() {
    let name = this.type.name;
    let skill = this.type.skill;
    let healthRange = `${this.type.lowHealth} - ${this.type.highHealth}`;
    let dmgRange = `${this.type.lowDamage} - ${this.type.highDamage}`;

    let output = `
    	<hr>
    	<h2>
    	<popGreen>Type:</popGreen><br/>
    	<pop>${name}</pop><br/>
    	<popGreen>Skill:</popGreen><br/>
    	<pop>${skill}</pop><br/>
    	<popGreen>Health Range:</popGreen><br/>
    	<pop>${healthRange}</pop><br/>
    	<popGreen>Damage Range:</popGreen><br/>
    	<pop>${dmgRange}</pop><br/>
    	</h2>`;
    return output;
  };
};

BattleBots.Player.prototype.setName = function(newName) {
  this.playerName = newName;
};

BattleBots.Player.prototype.setType = function(newType) {
  this.type = new RobotModels[newType]();
};

module.exports = BattleBots;
