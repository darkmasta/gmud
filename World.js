 {

	Extends: Thing,
	Singleton: true,

	create: function(){
		this.parent();
		this.set("lobby", this.world.makeThing("/Rooms/Lobby"));
		this.set("character_creation", this.world.makeThing("/Rooms/Creation/Name"));
	},
	
	init: function(){
		this.parent();	
	}

}
