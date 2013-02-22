module.exports = {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
		this.set("name", "Character Creation - Name");
		this.set("description", "Welcome to the character creation. Creating your character is a three-step process: Chosing a name, your appearance and powerlevels. Start by thinking of a name for your character. Your character's name can contain spaces and should at least consist of a first and last name. Choose your name by typing 'name <name> <surname>'.");
	},

	init: function(){
		this.parent();
		this.addCommand("name @text", "chooseName");
		this.next = this.world.makeThing("Rooms/Creation/Appearance");
	},
	
	chooseName: function(who, text){
		if(text.indexOf(" ") < 3){
			who.send("Please try another name");
			return;
		}
		who.set("name", text);
		who.send("Your name is now: "+text);	
		this.next.warp(who);
	}
}
