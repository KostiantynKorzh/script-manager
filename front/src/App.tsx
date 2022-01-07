import React, {useState} from 'react';
import {Box, Fab, TextField} from "@mui/material";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {Scripts} from "./components/Scripts";
import {Jobs} from "./components/Jobs";

export type ScriptField = {
    id: any;
    name: string;
    body: string;
    params: any;
}

const App = () => {

    const generateTemporaryIdForScriptField = () => {
        return 'id' + (new Date()).getTime();
    }

    const [fields, setFields] = useState<any[]>([{
        id: generateTemporaryIdForScriptField(),
        name: "",
        body: ""
    }]);

    const reorder = (list: any, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const updatedFields = reorder(
            fields,
            result.source.index,
            result.destination.index
        );

        setFields([...updatedFields]);
    }

    const renderCard = (field: ScriptField, index: number) => {
        return (
            <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided: any) => (
                    <div ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                    >
                        <TextField
                            placeholder="Write script name"
                            variant="filled"
                            value={field.name}
                            onChange={(e) => {
                                const fieldIndex = fields.findIndex((fieldFromArray => fieldFromArray.id === field.id));
                                fields[fieldIndex].name = e.target.value;
                                setFields([...fields]);
                            }}/>
                        Hold to Drag
                        <TextField
                            multiline
                            minRows={4}
                            fullWidth
                            placeholder="Write script here"
                            variant="filled"
                            value={field.body}
                            onChange={(e) => {
                                const fieldIndex = fields.findIndex((fieldFromArray => fieldFromArray.id === field.id));
                                fields[fieldIndex].body = e.target.value;
                                setFields([...fields]);
                            }}/>
                    </div>
                )}
            </Draggable>
        )
    };

    const renderCardList = () => {
        return (
            fields && fields.map((field: ScriptField, index) => (
                renderCard(field, index)
            ))
        )
    }


    return (
        <>
            <div
                style={{
                    width: "50%"
                }}
            >
                <Box>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided: any) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    // style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {renderCardList()}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Fab color="primary" aria-label="add"
                         onClick={() => {
                             setFields((prev: any) => [...prev, {
                                 id: generateTemporaryIdForScriptField(),
                                 name: "",
                                 body: ""
                             }])
                         }}
                    >
                        +
                    </Fab>
                    <Fab color="primary" aria-label="add"
                         onClick={() => {
                             console.log(fields);
                         }}
                    >
                        Finish
                    </Fab>
                </Box>
            </div>
            {/*<Scripts/>*/}
            <Jobs/>
        </>
    )
}

export default App;
