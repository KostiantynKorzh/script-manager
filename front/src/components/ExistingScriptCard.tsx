import React from 'react';

export const ExistingScriptCard = ({script}: any) => {
    return (
        <>
           <h1>{script.name}</h1>
           <h1>{script.body}</h1>
        </>
    );
};

export default ExistingScriptCard;