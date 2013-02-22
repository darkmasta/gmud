module.exports = {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
		this.set("name", "Character Creation - Powerlevels");
		this.set("description", "");
	},

	init: function(){
		this.parent();
		this.addExit("back", "b", "next room", "Appearance");
	},
	
}
