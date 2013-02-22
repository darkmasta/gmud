 {
	Extends: 'Living', 

	create: function(){
		this.parent();
	},

	init: function(){
		this.parent();
		
		this.setDefault("name", "Player");
		this.setDefault("description", "A new player");

		this.addCommand("save", "saveWorld");
		this.addCommand("reload", "reloadWorld");
	},

	onEnter: function(where){
		this.force("look");
	},

	saveWorld: function(who){
		who.send("Saving world to disk.");
		this.world.save();
		who.send("Finished dumping the world to disk.");
	},
	
	reloadWorld: function(who){
		if(this.controller)
			this.controller.fireEvent("reloadWorld");
	}
}
