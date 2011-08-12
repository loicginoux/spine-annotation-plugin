
window.NotesManager = Spine.Controller.create({
    elements: {
        "img": "img"
    },

    events: {
        "mouseup": "process",
        "mousedown img":  "createNote",
        "mousemove": "move",
        "click":  "preventDefault"
    },

    proxied: ["createNote", "addOne", "process", "move", "stopAllEdition", "render", "removeNote"],

    nextId: 0,
    
    init: function(){
        this.mouseDown = false;
        Note.bind("create",  this.addOne);           
        this.annotations = [];     
    },

    createNote: function(event){ 
                       
        event.preventDefault();
        this.mouseDown = true;
        var positionAtEvent = this.positionAtEvent(event);
        //Note.changeCurrent();
        if ($("div.note.current").size() > 0) {
            var currentNote = this.annotations[this.annotations.length-1];
            currentNote.remove();
        }
        
        Note.create({
            owner: 'test',
            type:"new",
            position: this.annotations.length+1,
            //current: true,
            width:0,
            height:0,
            left:positionAtEvent.left,
            top:positionAtEvent.top
        });
        
        //console.log("create note", positionAtEvent.left, positionAtEvent.top)

    },
    
    render: function(note){        
        var noteEl = this.template(note).addClass("current resizing")
        if (note.isSmall()) {
           noteEl.hide()
        }
        this.el.append(noteEl);
        this.noteEl = this.el.children().last();
        return this.noteEl;
    },
    
    template: function(note){         
        return $('#noteTemplate').tmpl(note);
    },

    addOne: function(note){
        this.render(note).addClass("current resizing");
        var noteItem = NoteItem.init({
            note:note,
            NotesManager:this,
            el:this.noteEl
        });
        this.annotations.push(noteItem)
    },

    process: function(){        
        if (this.mouseDown) {	            				
            this.mouseDown = false;
           // console.log("this.currentNote:",this.currentNote);
            
            if ($("div.note.editing").size() > 0) {
                this.stopAllEdition();
            }
 
            
                       
            //var note = Note.current()[0];            
            var lastNoteItem = this.annotations[this.annotations.length-1];
            var note = lastNoteItem.note;
            // this.currentNote = NoteItem.init({
            //                 note:note,
            //                 NotesManager:this,
            //                 el:this.noteEl
            //             });  
            //             this.annotations.push(this.currentNote);
            //             console.log(this.annotations)
            
            if (note.isSmall()) {
                lastNoteItem.resizeToFixedBox();
            }
            lastNoteItem.makeEditable();
            this.updateAllNotePositions();
            
        }
    },

    move: function(event){        
        if (this.mouseDown) {
            event.preventDefault();
            var note = this.annotations[this.annotations.length-1].note;
            var offsetEl = this.el.offset();
            var width = event.pageX - offsetEl.left - note.left;
            var height = event.pageY - offsetEl.top - note.top;
            width = (width<0)?0:width;			
            height = (height<0)?0:height;
            note.updateAttributes({
    		    width:width,
    		    height:height
    		});
    		/*this.noteEl.css({
    		    width:width+"px",
    		    height:height+"px",
    		    top:note.top+"px",
    		    left:note.left+"px"
    		});*/
    		/**if (!note.isSmall()) {
    		    this.noteEl.show();
    		}*/
            	
        }
    },

    addAll: function(serializedAnnotations){

    },

    removeAll: function(){

    },

    positionAll: function(){

    },

    serializeAll: function(){

    },

    positionAtEvent: function (event,xpos,ypos) {
        var left = event.pageX - this.el.offset().left //- ($(this).xOffset(xpos));
        var top = event.pageY - this.el.offset().top //- ($(this).yOffset(ypos));	
        return {left:left, top:top};				

    },
    
    stopAllEdition:function(n) {
        $.each(this.annotations, function (i, noteItem) {
            if (noteItem && noteItem.el && noteItem.el[0] !== n) {
                //noteItem.setText(noteItem.textarea.val());
                noteItem.stopEditing();
            }
        })
    },
     
    removeNote: function(position){
        this.annotations.splice(position-1, 1);
    },   
    
    updateAllNotePositions: function(){
        console.log("updateAllNotePositions:", this.annotations);
        
        $.each(this.annotations, function (i, noteItem) {
            console.log(noteItem.note.position);
            
            noteItem.note.position = i + 1;
            noteItem.note.save();
        })
    },
    
    preventDefault: function(event) {
        event.preventDefault()
    }
});

