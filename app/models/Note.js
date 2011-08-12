var Note = Spine.Model.setup("Node", ["left", "top", "width", "height", "comment","position", 'owner', "type"]);

//Note.extend(Spine.Model.Local);

Note.include({
  isSmall: function(){
      return this.width <= 20 && this.height <= 20
  }  
  
});

