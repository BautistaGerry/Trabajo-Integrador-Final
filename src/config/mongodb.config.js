import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"

let isConnected = false;

const connectMongoDB = async () => {
    if (isConnected) {
        console.log("MongoDB ya estaba conectado");
        return;
    }
    try {
        const db = await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING, {
            dbName: ENVIRONMENT.MONGO_DB_NAME
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("La conexion con MongoDB funciona")
    }
    catch (error) {
        console.error("Hubo un fallo en la conexion de la DB", error)
    }
}

export default connectMongoDB