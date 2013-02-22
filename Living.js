module.exports = {
	Extends: Thing,
 
	controller: null,

	create: function(){
		this.parent();
		this.set("name", "Being");
		this.set("description", "It's alive!");
		this.set("look_place", "standing here.");
		this.set("inventory", this.world.makeThing("Inventory"));
	},
	
	init: function(){
		this.parent();
		this.addCommand("look @thing", "lookAtItem");
		this.addCommand("look", "lookAtRoom");
		this.addCommand("give @thing to @thing and say @text", "test");
	},

	test: function(who, thing, recv, text){
		console.log(thing.get("name"));
		console.log(recv.get("name"));
		console.log(text);
	},
		
	send: function(message, style){
        if(this.controller)
			this.controller.send(message, style);
	},
	
	send_raw: function(message, style, nl){
        if(this.controller)
			this.controller.send_raw(message, style, nl);
	},
	
	sendLine: function(line, style){
        if(this.controller)
			this.controller.sendLine(line, style);
	},

	lookAtItem: function(who, item){
		if(item){
			who.send([item.get('description')]);	
		}else{
			who.send("You don't see that here.");
		}
	},
	
	lookAtRoom: function(who){
		var container = who.get('_container');
		if(container){
			who.send_raw(container.getName(), "label", true);
			who.send(container.get('description'));
			if(!container.get("contents_hidden")){
				var things = container.filter("Living", true).map(function(thing){
					var name = thing.getName();
					return name.getArticle() + " ["+name.toLowerCase()+"]";
				}, this);
				if(things.length > 0)
					who.sendLine("You see "+things.conjoin(), "item");

				var livings = container.filter("Living").map(function(thing){
					if(thing == this) return null;
					var name = thing.getName();
					return "["+name.capitalize()+"]" + " is " + thing.get("look_place");
				}, this);
				livings = livings.clean();
				if(livings.length > 0)
					who.sendLine(livings.join(" "), "living");
				

				if(!container.exits || container.exits.length == 0){
					who.sendLine("There are no visible exits");
				}else{
					var exits = container.exits.map(function(exit){
						return exit.exit + " [("+exit.short+")]";
					}, this);
					who.sendLine((exits.length == 1 ? "There is an exit" : "There are exits ") + " to the "+exits.conjoin(), "exit");
				}
			}	
		}else{
			who.send("You're nowhere.");
		}
	},
	
	scanForThing: function(name){
		var index = name[0].toCountingNumber();
		if(index != -1){
			name = name.slice(1);
		}else index = 1;
		var result = [];
		var inventory = this.get('inventory');
		result.append(inventory.scan(name));
		var container = this.get('_container');
		if(container){
			result.append(container.scan(name));
		}
		return result[index-1] ? result[index-1] : null;
	},

	//Runs a command and returns true on success
	runCommand: function(command){
		var parts = command.split(" ");	
		if(this.checkAndRunCommand(this, 1, parts, true)) return true;
		
		var count = 0;
		var runFunc = function(thing, index){
			if(thing == this) return false;
			count++;
			return this.checkAndRunCommand(thing, count, parts, false);
		}.bind(this);

		var inventory = this.get('inventory');
		if(inventory._contains.some(runFunc)) return true;

		var container = this.get('_container');
		if(container){
			if(this.checkAndRunCommand(container, 1, parts, true)) return true;
			if(container._contains.some(runFunc)) return true;
		}

		return false;
	},

	force: function(command){
		return this.runCommand(command);	
	},

	//Performs some checks on the command, tries to select the right one and
	//executes it
	checkAndRunCommand: function(thing, thing_index, parts, priv){
		//Expand alias
		parts[0] = thing._alias[parts[0]] || parts[0];
		return thing._commands.some(function(val){
			if(!priv && val.priv) return false;
			var cmd_args = this.parseCommandArguments(val.syntax, parts);
			if(!cmd_args) return false;
			var not_this = false;	
            cmd_args = cmd_args.filter(function(arg){
				if(arg.type == "@this") {
                    if(!not_this) not_this = !thing.doesNameAndNumberMatch(arg.value, thing_index);
                    return false;
                }
                return true;
            }, this);
            if(not_this) return false;
			cmd_args = cmd_args.map(function(arg){
				if(arg.type == "@text") return arg.value.join(" ");
				if(arg.type == "@thing") return this.scanForThing(arg.value);
			}, this);
			if(cmd_args.contains(null)){
				this.send("I don't see that here.");
				return true;
			}
			thing[val.func].apply(thing, [this].append(cmd_args));	
			return true;
		}, this);
	},

	//Parses the command and prepares the arguments
	parseCommandArguments: function(syntax, command){
		if(command.length < syntax.length) return null;
		var pi = 0;
		var cmd_args = [];
		for(var i = 0; i < syntax.length; ++i){
			if(pi >= command.length) return null;
			var syntax_arg = syntax[i];	
			if(syntax_arg.charAt(0) == "@"){
				var limiter = i+1 < syntax.length ? syntax[i+1] : false;
				var arg_thing_name = false;
				if(limiter){
					var limit_index = command.indexOf(limiter, pi);
					if(limit_index == -1) return null;
					arg_thing_name = command.slice(pi, limit_index);
					pi = limit_index;
				}else{
					arg_thing_name = command.slice(pi);
				}
				cmd_args.push({type : syntax_arg, value : arg_thing_name});
			}else{
				if(syntax_arg != command[pi]) return null;
				++pi;	
			}
		}
		return cmd_args;
	},
	
    /**
	 * Emits a message to everyone in the room.
	 */
	emit: function(message, target, style) {
		if (target && target.length) {
			style = target;
			target = false;
		}

		var messages = (message.each) ? message : message.expand(this, target);

		if (!this.get('_container')) {
			throw "Living "+this.getShort()+" has no room.";
		}
		
		Object.each(this.get('_container').filter('Living'), function(player) {
			if (target && player.guid == target.guid) {
				player.sendLine(messages[1], style);
			} else if (player == this) {
				player.sendLine(messages[0], style);
			} else {
				player.sendLine(messages[2], style);
			}
		}, this);

	},

    showPrompt: function(prompt){
        if(this.controller)
            this.controller.setPrompt(prompt);
    }
};
