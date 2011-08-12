var NoteItem = Spine.Controller.create({

    elements:{
        ".note-body": "noteBody",
        "button.ok": 'saveNoteButton',
        "textarea": "textarea",
        "span.nub": "nub",
        ".border": "border",
        "span.n-count": "nbCount",
        "p.owner": "owner",
        ".overlay": "overlay",
        ".delete-note": "deleteButton"
    },

    events: {
        "click .overlay": "clickOverlayEvent",
        "click .delete-note":  "clickDeleteEvent",
        "click button.ok": "saveNoteText",
        "keydown textarea":  "updateSaveButton",
        "drag":"savePosition"
    },

    proxied: ["render", "remove", "show", "isSmall", "updateEl", "saveNoteText",
    "remove", "coordinates", "positionNoteBody","noteBodyStartsInsideWindow", "makeEditable", 
    "setText","stopEditing","startEditing", "empty", "updateSaveButton",
    "makeDraggable", "makeResizable", "clickOverlayEvent", "clickDeleteEvent"],

    init: function(){
        this.note.bind("change refresh",  this.updateEl);   
        this.noteBodyWindowPositionOffset = 40;
        this.container = this.NotesManager.el;
    },

    show: function(){
        this.el.show();
    },

    isSmall: function(){
        return this.note.isSmall();

    },
    remove: function(){
        this.NotesManager.removeNote(this.note.position)
		if (!this.el.hasClass('saved')) {				
			this.NotesManager.updateAllNotePositions();
		};
        this.note.destroy();
        this.el.remove();
    },

    updateEl: function(){
        var note = this.note;
        this.el.css({
            width: note.width + "px",
            height: note.height + "px",
            top: note.top + "px",
            left: note.left + "px",
        })
        if(!note.isSmall()){
            this.el.show();
        }
        this.nbCount.html(note.position)
        console.log("updateEl - pos =",note.position);
        
    },

    coordinates: function(){
        return {
            width: this.note.width,
            height: this.note.height,
            left: this.note.left,
            top: this.note.top
        }
    },

    resizeToFixedBox: function(){
        var width = 100;
        var height = 100;	        	
        var left = this.coordinates().left - 50;
        var top = this.coordinates().top - 50;
        this.note.updateAttributes({
            width: width,
            height: height,
            left:  left,
            top:  top
        });	
    },


    positionNoteBody: function () {	
        console.log("position note body");

        this.noteBody.css("top", this.note.height + 10 + "px");
    },

    makeEditable: function(){
        console.log("makeEditable:");
        this.el.removeClass("resizing").show();
        this.positionNoteBody()
        this.NotesManager.stopAllEdition();
        this.startEditing();
        this.textarea.select();
        this.makeDraggable();
        this.makeResizable();
        this.el.trigger("addNote");
    },

    clickOverlayEvent: function (event) {
        console.log("clickOverlayEvent:");
        this.textarea.select();
        this.NotesManager.stopAllEdition(this.el[0]);
        this.startEditing()
    },

    clickDeleteEvent:function (event) {
        console.log("clickDeleteEvent:");

        event.preventDefault();
        this.remove();
        var nbReadOnly = $("div.note.read-only").size();
    },


    saveNoteText: function () {
        console.log("save note:");
        this.el.removeClass("current")
        this.setText(this.textarea.val());
        this.stopEditing();
    },

    setText: function(text){
        console.log("settext:", text);

        this.note.updateAttributes({comment:text});

        if (text && text !== "") {
            this.el.addClass("has-text").find("p.body").html(text)
            this.textarea.val(text);
            this.noteBody.removeClass("hide-text");
        } else {
            this.noteBody.addClass("hide-text");
            this.el.removeClass("has-text");
        }
    },

    stopEditing: function () {			
        if (this.el.hasClass("editing")) {
            this.el.removeClass("editing").addClass("editable");
            if (this.empty()) {
                this.remove()
            }
            this.el.trigger("updateText")
        }
    },

    startEditing: function () {
        this.updateSaveButton();
        this.el.removeClass("editable").addClass("editing");
        this.textarea.select();
        this.el.draggable("option", "disabled", false);
        this.el.resizable("option", "disabled", false)
    }, 

    empty: function () {
        return this.textarea.val() === ""
    },

    updateSaveButton: function () {
        var self = this;
        var fn = function(){
            if (self.empty()) {
                self.saveNoteButton.attr("disabled", true).addClass("disabled");
            } else {
                self.saveNoteButton.attr("disabled", false).removeClass("disabled");
            }
        }
        setTimeout(fn, 0);
        
    },

    makeDraggable: function () {
        var self = this
        this.el.draggable({
            containment: "parent",
            handle: "div.overlay",
            start: function (event, ui) {
                self.el.addClass("dragging");
                console.log("stat dragging:");

                
            },
            stop: function (event, ui) {
                self.el.removeClass("dragging");
                console.log("stop dragging:");
                self.note.updateAttributes({
                    left:self.el.css("left"),
                    top:self.el.css("top")
                })
                self.el.trigger('drag');
            }
        })
    },
    makeResizable: function () {
        var self = this;
        this.el.resizable({
            handles: {
                ne: ".top-right",
                se: ".bottom-right",
                sw: ".bottom-left",
                s: ".bottom",
                n: ".top",
                e: ".right",
                w: ".left"
            },
            containment: "parent",
            start: function (event, ui) {
                self.el.addClass("resizing")
            },
            stop: function (event, ui) {
                self.noteBody.css("top", self.el.height() + 10 + "px");
                self.el.removeClass("resizing");
                self.el.trigger("moveNote");
                self.note.updateAttributes({
                    width:self.el.css("width").replace("px", ""),
                    height:self.el.css("height").replace("px", ""),
                    top:self.el.css("top").replace("px", ""),
                    left:self.el.css("left").replace("px", "")
                })
            }
        })
    },



});