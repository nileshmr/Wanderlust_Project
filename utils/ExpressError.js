class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError ; // module ke andar export kr diye ExpressError class ko.