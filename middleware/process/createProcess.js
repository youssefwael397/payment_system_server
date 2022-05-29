const createProcess = (req, res, next) => {
    
    // go to the next middleware
    return next();
};

module.exports = createProcess;