import mongoose from "mongoose";


export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB Connected")
        })

        connection.on('error', (error) => {
            console.log("MongoDB Connection Error. please make sure db is up and running: " + error)
            process.exitCode = 1
        })

        
    } catch (error) {
        console.log('Something went wrong in the connection to DB')
        console.log(error)
    }
}