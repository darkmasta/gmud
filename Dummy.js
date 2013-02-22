{
	Extends: '/Living', 

	create: function(){
		this.parent();
	},

	init: function(){
		this.parent();
	},

	onEnter: function(where){
		this.force("look");
	},

}
