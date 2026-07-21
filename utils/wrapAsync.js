module.exports= (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);  // agar koi error catch hota hai to uske liye hmara next call hojaye- catch(next).
    }
}