const { connect } = require("mongoose");

async function dbConnect() {
    const DB_URI =
        process.env.URL_MONGO;
    await connect(DB_URI);
}

module.exports = {dbConnect};