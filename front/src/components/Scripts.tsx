import React, {useEffect, useState} from 'react';
import {getAllScripts} from "../services/ScriptService";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography} from "@mui/material";
import {ScriptField} from "../App";

export const mapParamsStringToArray = (paramsString: string): string[] => {
    const paramsMap = JSON.parse(paramsString);
    const paramsArray: string[] = [];
    if (paramsMap) {
        Object.keys(paramsMap).forEach(key => {
            paramsArray.push(key);
        });
    }

    return paramsArray;
};

export const renderParamsInput = (paramsString: string, onChange: (paramName: string, value: any) => void) => {
    const paramsArray = mapParamsStringToArray(paramsString);
    return (
        paramsArray.map(param => (
            <div>
                {param}
                {/*script1, script2... are reserved for scripts result to pass in another scripts*/}
                {!param.includes("script") &&
                    <>
                        : {"\n"}
                        <TextField
                            onChange={(e) => {
                                onChange(param, e.target.value);
                            }}
                        />
                    </>
                }
            </div>
        ))
    )
};

export const Scripts = () => {
    const [scripts, setScripts] = useState<ScriptField[]>();

    useEffect(() => {
        getAllScripts()
            .then(scripts => {
                setScripts(scripts);
            })
            .catch(alert);
    }, [])

    return (
        <>
            <Box>
                {scripts && scripts.map((script) => (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={"v"}
                        >
                            <Typography sx={{width: '33%', flexShrink: 0}}>
                                {script.name}
                            </Typography>
                            <Typography sx={{color: 'text.secondary'}}>
                                {script.id}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Body: {"\n"}
                            </Typography>
                            <pre>
                                {script.body}
                            </pre>
                            {
                                (() => {
                                    if (script.params && script.params.length !== 0 && script.params !== "{}") {
                                        return <>
                                            <Typography>
                                                Params: {"\n"}
                                            </Typography>
                                            {renderParamsInput(script.params, () => {
                                            })}
                                        </>
                                    }
                                })()}
                            <Button variant="contained"
                                    onClick={() => {

                                    }}
                            >Run</Button>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </>
    );
};