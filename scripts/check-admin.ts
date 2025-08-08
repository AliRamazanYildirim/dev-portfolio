import { db } from "../lib/db";

async function checkAdmin() {
  try {
    const admin = await db.adminUser.findUnique({
      where: { email: "aliramazanyildirim@proton.me" },
    });

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
    await db.$disconnect();
  }
}

checkAdmin();
