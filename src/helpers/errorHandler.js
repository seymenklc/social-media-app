export const errorHandler = (errors) => {
    let currentError = [];

    errors && errors.map((error, index) => errors[index] && (
        currentError.push(error)
    ));

    return currentError;
};