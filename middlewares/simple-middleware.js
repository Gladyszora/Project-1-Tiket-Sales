const midOne = async (request, response, next) => {
    console.log("=================================");
    console.log("Run Middleware One");
    console.log("Method :", request.method);
    console.log("URL    :", request.originalUrl);
    console.log("=================================");

    next();
};

module.exports = {
    midOne
};