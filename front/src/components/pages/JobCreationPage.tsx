import React, {useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Autocomplete, Box, Button, ButtonGroup, Modal, TextField, Typography} from "@mui/material";
import {ScriptField} from "../../App";
import {getAllScripts} from "../../services/ScriptService";
import {createJob} from "../../services/JobService";

export const JobCreationPage = () => {
    const [fields, setFields] = useState<any[]>([]);
    const [existingScriptModalOpen, setExistingScriptModalOpen] = useState<boolean>(false);
    const [scripts, setScripts] = useState<any[]>([]);
    const [selectedNewScript, setSelectedNewScript] = useState<any>({});
    const [jobName, setJobName] = useState<string>("");

    useEffect(() => {
        getAllScripts()
            .then(scripts => setScripts(scripts))
            .catch(alert)
    }, [])

    const generateTemporaryIdForScriptField = () => {
        return 'id' + (new Date()).getTime();
    }

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

    const onSave = () => {
        const formattedSteps: any = [];
        fields.forEach(step => {
            const isNewScript = isNaN(step.id);
            if (isNewScript) {
                formattedSteps.push({
                    name: step.name,
                    scriptBody: step.body,
                    params: {}
                });
            } else {
                formattedSteps.push(step.id);
            }
        })

        createJob(jobName, formattedSteps, {})
            .then(console.log)
            .catch(alert);
    }

    const renderCard = (field: ScriptField, index: number) => {
        return (
            <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                {(provided: any) => (
                    <div ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                    >
                        <TextField
                            placeholder="Write script name"
                            variant="filled"
                            disabled={!isNaN(field.id)}
                            value={field.name}
                            onChange={(e) => {
                                const fieldIndex = fields.findIndex((fieldFromArray => fieldFromArray.id === field.id));
                                fields[fieldIndex].name = e.target.value;
                                setFields([...fields]);
                            }}
                        />
                        Hold to Drag
                        <Button variant="outlined" color="error"
                                onClick={() => {
                                    const fieldToDeleteIndex = fields.findIndex(fieldFromArray => fieldFromArray.id === field.id);
                                    if (fieldToDeleteIndex !== -1) {
                                        fields.splice(fieldToDeleteIndex, 1);
                                        setFields([...fields]);
                                    }
                                }}
                        >
                            Delete
                        </Button>
                        <TextField
                            multiline
                            minRows={4}
                            fullWidth
                            placeholder="Write script here"
                            variant="filled"
                            disabled={!isNaN(field.id)}
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

    const actionButtons = <>
        <ButtonGroup variant="text" aria-label="text button group">
            <Button
                onClick={() => {
                    setFields((prev: any) => [...prev, {
                        id: generateTemporaryIdForScriptField(),
                        name: "",
                        body: ""
                    }]);
                }}
            >Create new</Button>
            <Button
                onClick={() => {
                    setExistingScriptModalOpen(true);
                }}
            >Add existing one</Button>
            <Button
                onClick={() => {
                    onSave();
                }}
            >Save</Button>
        </ButtonGroup>
        {/*<Fab color="primary" aria-label="add"*/}
        {/*     onClick={() => {*/}
        {/*         setFields((prev: any) => [...prev, {*/}
        {/*             id: generateTemporaryIdForScriptField(),*/}
        {/*             name: "",*/}
        {/*             body: ""*/}
        {/*         }]);*/}
        {/*     }}*/}
        {/*>*/}
        {/*    +*/}
        {/*</Fab>*/}
        {/*<Fab color="primary" aria-label="add"*/}
        {/*     onClick={() => {*/}
        {/*         console.log(fields);*/}
        {/*     }}*/}
        {/*>*/}
        {/*    Save*/}
        {/*</Fab>*/}
    </>

    return (
        <>
            <div
                style={{
                    width: "50%"
                }}
            >
                <Box>
                    {actionButtons}
                    <TextField
                        label="Job name"
                        value={jobName}
                        onChange={(e) => {
                            setJobName(e.target.value)
                        }}
                    />
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
                </Box>
            </div>
            <Modal
                open={existingScriptModalOpen}
                onClose={() => setExistingScriptModalOpen(false)}
            >
                <Box style={{
                    position: "fixed",
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: "#c29090"
                }}
                >
                    <Typography variant="h6" component="h2">
                        Just testing...
                    </Typography>
                    <Autocomplete
                        sx={{width: 300}}
                        renderInput={(params) => <TextField  {...params}/>}
                        options={scripts.map(script => {
                            return {
                                label: script.name,
                                id: script.id
                            }
                        })}
                        value={selectedNewScript && selectedNewScript.label || ""}
                        onChange={(event: any, newValue: string | null) => {
                            setSelectedNewScript(newValue);
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            const selectedScript = scripts.find(script => script.id === selectedNewScript.id);
                            if (selectedScript) {
                                fields.push({
                                    id: selectedScript.id,
                                    name: selectedScript.name,
                                    body: selectedScript.body
                                });
                                setExistingScriptModalOpen(false);
                            }
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>
        </>
    )
};

export default JobCreationPage;