module.exports = {

	Extends: 'Room',
	
		create: function(){
		this.parent();
		this.set("name", "Lobby");
		this.set("description", "Login with 'connect name password' or register with 'register name'");
	},

	init: function(){
		this.parent();
		this.addCommand("connect @text", "connect");
		this.addCommand("register @text", "register");
	},
	
	connect: function(who, text){
		var parts = text.clean().split(" ", 2);
		if(parts.length < 2){
			who.send("No password given");
			return;
		}
		var user = this.world.getMaster().get("user_"+parts[0]);
		if(!user || (user.password != this.encryptPassword(parts[1]))){
			who.send("Wrong login credentials");
			return;
		}
		who.send("You feel the slight sensation of being transfered into another body...");
		who.controller.setControl(user.character);
		user.character.force("look");
	},

	register: function(who, text){
		var name = text.trim();
		if(name.contains(" ")){
			who.send("Name can't contain spaces");
			return;
		}
		if(this.world.getMaster().get("user_" + name)){
			who.send("An user with this name is already registered");	
		}
		who.send("Enter a password:");
		who.showPrompt(this.askPasswordPrompt.bind(this, name, null));	
	},

	encryptPassword: function(password){
		//TODO bcrypt
		return password;
	},

	askPasswordPrompt: function(name, password, who, text){
		text = text.trim();
		if(!password){
			who.send("Repeat password:");
			return this.askPasswordPrompt.bind(this, name, text);	
		}else{
			if(password != text){
				who.send("Passwords don't match");
			}else{
				who.send("Creating your account...");
				var character = this.world.makeThing("Player");
				var creation = this.world.getMaster().get("character_creation");
				character.enter(creation);
				var user = {name:name, password:this.encryptPassword(password), character:character};
				this.world.getMaster().set("user_" + name, user);
				who.send("Done. You can now login.");
			}
		}
	}

}
