const express  = require('express');
const router = express.Router();
const  fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const  {body, validationResult} =  require('express-validator');


//ROUTE 1: Get All the notes  using : POST  "/api/notes/getuser" .login required
router.get('/fetchallnotes',fetchuser, async (req,res) => {
       try{
            const notes = await Note.find({user: req.user.id});
            res.json(notes)
       } catch(error) {
            console.error(error.message);
             res.status(500).send("Internal server error");
       }
         const notes = await notes.find({user: req.user.id});
        res.json(notes)
})

//ROUTE 2: Add a new note using : POST  "/api/notes/addnote" .Login required
router.post('/addnote',fetchuser,[
      body('title','Enter a valid title').isLength({ min:3 }),
      body('description', 'Description must be atleast 5 characters').isLength({ min:5 }),], async (req,res) => {
            try{

           
      const {title, description,tag} = req.body;
      //if there are errors, return bad request and the errors
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
     }
     const note = new Note ({
          title,description,tag,user: req.user.id
     })

     const savedNote = await note.save()
     res.json(savedNote)
    }  catch(error) {
      console.error(error.message);
       res.status(500).send("Internal server error");
 }
})

//ROUTE 3: update  an existing note using : Put  "/api/notes/updatenote" .Login required(53)

router.put('/updatenote/:id',fetchuser, async(req, res) => {
            const {title, description, tag} = req.body;

            try{
            //create a newNote object
            const newNote = {};
            if(title){newNote.title = title};
            if(description){newNote.description = description};
            if(tag){newNote.tag = tag};

            //Find the note to be updated and update it
            let  note = await Note.findById(req.params.id);
            if(!note){return res.status(404).send("Not Found")}

            if(note.user.toString() !== req.user.id){
                  return res.status(401).send("Not Allowed");
            }

            note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
            res.json({note});
      }  catch(error) {
            console.error(error.message);
             res.status(500).send("Internal server error");
       }
      })

    
//ROUTE 4: Delete  an existing note using : DELETE  "/api/notes/updatenote" .Login required(54 VIDEO)

router.delete('/deletenote/:id',fetchuser, async(req, res) => {
     // const {title, description, tag} = req.body;
      try{
      //Find the note to be updated and update it
      let  note = await Note.findById(req.params.id);
      if(!note){return res.status(404).send("Not Found")}
 
      //Allow deletion only if user owns this note
      if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
      }

      note = await Note.findByIdAndDelete(req.params.id)
      res.json({"Success":"Note has been deleted", note: note});
}  catch(error) {
      console.error(error.message);
       res.status(500).send("Internal server error");
 }
})
 module.exports = router;