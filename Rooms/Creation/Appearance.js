module.exports = {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
		this.set("name", "Character Creation - Appearance");
		this.set("description", "Now you have to define how you look to others. You can always change your description later to reflect visible changes of your character. Set your description by typing: 'desc <text>'.");
	},

	init: function(){
		this.parent();
		this.addCommand("desc @text", "desc");
		this.addExit("back", "b", "next room", "Rooms/Creation/Name");
		this.next 
	},
	
	desc: function(who, text){
		who.set('description', text);
		this.next.warp(who);
	}
}
