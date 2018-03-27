const errorFactory = {
    SequelizeDatabaseError(error) {
        return new Error(error.message || error.parent.message);
    },
    SequelizeValidationError(error) {
        return new Error(error.message);
    },
    SequelizeUniqueConstraintError(error) {
        return new Error(`${error.message}. ${error.parent.message}`);
    },
    SequelizeForeignKeyConstraintError(error) {
        return new Error(`The ${error.fields[0]} ${error.value} does not exists`);
    }
};

module.exports = (error) => {

    let clientError;

    if (error.status == 400 && error.errors) {
        clientError = new Error(
            error.errors
            .map(field => field.messages)
            .reduce((prev, message) => [...prev, ...message], [])
            .join()
        );
    } else {
        clientError = errorFactory[error.name] && errorFactory[error.name](error);
    }

    if (clientError) {
        clientError.status = 400;
        clientError.parent = error;
        return clientError;
    }

};
