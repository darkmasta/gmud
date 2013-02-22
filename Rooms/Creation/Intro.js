module.exports = {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
		this.set("name", "Character Creation - Done!");
		this.set("description", "Now you're ready to enter the game world. Please read the @rules and stay IC (In Character) at all times. An exception is the OOC (Out of Character) chat. Lying about are some items that will get you started. Pick them up by typing 'get <item>'.");
	},

	init: function(){
		this.parent();
		this.addExit("back", "b", "Intro", "Powerlevels");
		this.addExit("back", "game world", "game", "../World/City/Market");
	},
	
}
