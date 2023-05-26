const checkCommandModule = (cmdName: string, cmdModule: any): boolean => {
    if (!cmdModule.hasOwnProperty('name'))
        throw new Error(`${cmdName} command module does not have property 'name'`);

    if (!cmdModule.hasOwnProperty('description'))
        throw new Error(`${cmdName} command module does not have property 'description'`);

    if (!cmdModule.hasOwnProperty('run'))
        throw new Error(`${cmdName} command module does not have property 'run'`);

    return true;
}

const checkProperties = (cmdName: string, cmdModule: any): boolean => {
    if (typeof cmdModule.name !== 'string')
        throw new Error(`${cmdName} command: name must be a string`);

    if (typeof cmdModule.description !== 'string')
        throw new Error(`${cmdName} command: description must be a string`);

    if (typeof cmdModule.run !== 'function')
        throw new Error(`${cmdName} command: run must be a function`);

    return true;
}

export {
    checkCommandModule,
    checkProperties
};
