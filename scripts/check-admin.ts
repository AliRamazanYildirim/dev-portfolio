import { connectToMongo } from "../lib/mongodb";
import AdminModel from "../models/Admin";

async function checkAdmin() {
  try {
    await connectToMongo();
    const admin = await AdminModel.findOne({ email: "aliramazanyildirim@proton.me" }).exec();

    if (admin) {
      console.log("Admin found:");
      console.log("Email:", admin.email);
      console.log("Password hash:", admin.password);
      console.log("Active:", admin.active);
    } else {
      console.log("Admin not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await (await connectToMongo()).close();
  }
}

checkAdmin();
