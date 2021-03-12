const fs = require("fs");
const path = require("path");


module.exports = (app) => {
    //  read db/db.json to return all saved notes
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    app.get("/api/notes", (req, res) => {
        return res.json(noteList);
    });

    //  receive a new note to save on the request body, add it to db/db.json, and then return the new note to the client.
    app.post('/api/notes', (req, res) => {
        // get Id of last note if it exists
        let lastId;
        if (noteList.length) {
            lastId = Math.max(...(noteList.map(note => note.id)));
        //Otherwise set to 0
        } else {
            lastId = 0;
        }

        // change id to natural numbers (1 is the first)
        const id = lastId + 1;

        // pushes the note in the request.body onto the noteList
        noteList.push({ id, ...req.body });
        //Removes last index
        res.json(noteList.slice(-1));
        // writes db/db.json
        updateDb();
    });

    // deletes the note selected by id
    app.delete('/api/notes/:id', (req, res) => {
        // finds note by id, then converts the string into a JSON object with the id parameters of the request made
        let findNote = noteList.find(({ id }) => id === JSON.parse(req.params.id));

        // delete object matching id
        noteList.splice(noteList.indexOf(findNote), 1);
        updateDb();
        res.end(`Note was deleted`);
    });

    function updateDb() {
        fs.writeFile("db/db.json",JSON.stringify(noteList,'\t'),err => {
            if (err) throw err;
            return true;
        });
    }

    // returns the `notes.html` file.
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "./public/notes.html"));
    });
      
    // return the `index.html` file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });
    
};