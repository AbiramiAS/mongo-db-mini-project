import mongoose from "mongoose";

const connectDB = async () => {
          try {
                    await mongoose.connect(process.env.DATABASE_URI,
                              {
                                        // useUnifiedTopology: true,
                                        // useNewUrlParser: true
                              }
                    );
          }
          catch (err) {
                    console.log("Error Occured", err);
          }
}
export default connectDB