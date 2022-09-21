interface msArray {
    [index: number]: string;
}

let messages: msArray = {
    400: "Bad request",
    401: "Your request was made with invalid credentials",
    403: "Forbidden",
    404: "Not found"
};

interface ErrorStatus extends Error {
    status?: number
}

const throwError = (status: number, message: string | null = null): ErrorStatus => {
    message = message ?? (messages[status] ?? "Unknown error");
    let error: ErrorStatus = new Error(message);
    error.status = status;
    return error;
};
export default throwError;