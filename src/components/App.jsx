import React, { useState } from "react";
import Header from "./Header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import CreateArea from "./CreateArea";

const itemsFromBackend = [
  { id: uuidv4(), content: "Reading a book." },
  { id: uuidv4(), content: "Complete assignment 1." },
];

const columnsFromBackend = {
  [uuidv4()]: {
    name: "Todo",
    items: itemsFromBackend,
  },
  [uuidv4()]: {
    name: "In progress",
    items: [],
  },
  [uuidv4()]: {
    name: "Testing",
    items: [],
  },
  [uuidv4()]: {
    name: "Done",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {

  const [notes, setNote] = useState([]);

  function addTask(note){
    itemsFromBackend.push( { id: uuidv4(), content: note.content });
    setNote((prevNotes) => {
      return [...prevNotes, note];
    });
  }
  
  console.log(itemsFromBackend);
  
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div>
      <Header />
      
      <CreateArea onAdd = {addTask}/>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div className="columns">
                <h2>{column.name}</h2>
                <div className="column">
                  <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#669296"
                              : "#c7d7d4",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            borderRadius: 7
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div className="note"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#a57f5c"
                                          : "#F0A04B",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
