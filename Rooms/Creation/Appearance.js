 {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
	},

	init: function(){
		this.parent();
		
		this.setDefault("name", "Character Creation - Appearance");
		this.setDefault("description", "Now you have to define how you look to others. You can always change your description later to reflect visible changes of your character. Set your description by typing: 'desc <text>'.");

		this.addCommand("desc @text", "desc");
		this.addExit("back", "b", "next room", "Name");
		this.next = this.makeThing("Powerlevels");
	},
	
	desc: function(who, text){
		who.set('description', text);
		this.next.warp(who);
	}
}
