 {
		
	Extends: Thing,

	/* When something wants to warp to this thing, by default we do nothing.
	 * Rooms may want to override this to put things into themselves or doors
	 * to check whether to let the person pass 
	 */
	warp: function(who){
		who.send("Nothing happens as you try to warp to the warp target");	
	}
}
