window.App = Spine.Controller.create({
    el: $("body"),

    events: {
        "startResize": "onStartresize",
        "endResize": "onEndResize"
    },

    init: function(){   
        console.log("init:");
        
        this.notes = NotesManager.init({el: $("#annotatedImgContainer")});
        //Note.fetch();
    },

    startResize: function(event){
        this.serializedAnnotations = this.notes.serializeAll();				
        this.notes.removeAll();
    },

    endResize: function(event){
        this.notes.addAll(this.serializedAnnotations);
        this.notes.positionAll();
    }

})
