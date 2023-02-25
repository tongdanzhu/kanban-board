import React, { useState } from "react";

function CreateArea(props) {

  const [note, setNote] = useState({
    content: "",
  });

  function handleChange(event) {
    const {name, value} = event.target;
    
    setNote(preNote => {
        return {
            ...preNote,
            [name]: value
        };
    });
   
  }

  function submitNote(event){
    
    event.preventDefault();
    setNote({
        content: ""
      });
    props.onAdd(note);
  }

  return (
    <div>
      <form>
        <textarea
          name="content"
          value={note.content}
          onChange={handleChange}
          placeholder="Add Todo task..."
          rows="3"
        />
        <button onClick={submitNote}>+</button>
      </form>
    </div>
  );
}

export default CreateArea;
