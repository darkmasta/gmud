 { 

	Extends: '/WarpTarget',
	Singleton: true,
	
	exits: [],

	create: function(){
		this.parent();
	},

	init: function(){
		this.parent();
		
		this.setDefault('name', 'Room');
		this.setDefault('description', "You're standing in an unrendered room. It smells new.");

		this.addCommand("recreate", "recreate");
	},

	addExit: function(name, short_name, opposite, warp_target){
		var method_name = "_go"+name.capitalize();
		this[method_name] = function(who){
			who.emit("%You walk%s to the "+name);
			if(typeof(warp_target) == "string"){
				this.makeThing(warp_target).warp(who);
			}else{
				warp_target.warp(who);	
			}
			this.emit(who.getName() + " walks in from the "+opposite);
		}.bind(this);
		this.exits.push({exit:name, short:short_name});
		this.addCommand(name, method_name);
		this.addAlias(short_name, name);
	},

	emit: function(message, style){
		Object.each(this.filter('Living'), function(player) {
			player.sendLine(message, style);
		}, this);
	},
	
	warp: function(who){
		this.add(who);	
	},

	recreate: function(who){
		this.emit("The room shimmers as it gets replaced by another. In the blink of an eye it's over, too quick for anyone to notice.");
		this.create();	
	}
}
