 {

	Extends: "/Rooms/Room",

	create: function(){
		this.parent();
	},

	init: function(){
		this.parent();
		
		this.setDefault("name", "Character Creation - Powerlevels");
		this.setDefault("description", "");

		this.addExit("back", "b", "next room", "Appearance");
	},
	
}
