module.exports = {
	Extends: 'Living', 

	create: function(){
		this.parent();
		this.set("name", "Player");
		this.set("description", "A new player");
	},

	init: function(){
		this.parent();
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
