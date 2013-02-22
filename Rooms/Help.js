module.exports = {
	
	Extends: "/Rooms/Room",
	
	init: function(){
		this.parent();	
		this.addExit("south", "s", "north", "Rooms/Lobby");	
	}

}
