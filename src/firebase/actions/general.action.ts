"use server";

import { db } from "../admin";

export async function getAllUsers(): Promise<User[] | null> {
  try {
    const usersSnapshot = await db
      .collection("users") // Replace with your Firestore collection name for users
      .get();

    if (usersSnapshot.empty) {
      console.log("No users found");
      return null;
    }

    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}
export async function getAllInterviews(): Promise<Interview[] | null> {
  try {
    const interviewsSnapshot = await db
      .collection("interviews")
      .orderBy("createdAt", "desc") // optional: sort by latest
      .get();

    if (interviewsSnapshot.empty) {
      console.log("No interviews found");
      return null;
    }

    return interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}

// ✅ New function to get interviews by user ID
export async function getInterviewsById(userId: string): Promise<Interview[] | null> {
  try {
    const snapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error(`Error fetching interviews for user ${userId}:`, error);
    return null;
  }
}
export async function getFeedbackByUserId(userId: string): Promise<Interview[] | null> {
  try {
    const snapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error(`Error fetching feedback interviews for user ${userId}:`, error);
    return null;
  }
}

interface UserHere {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified?: boolean;
  packs?:string
}


export async function getOrdersWithUserInfo(): Promise<any[] | null> {
  try {
    const ordersSnapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    if (ordersSnapshot.empty) {
      console.log("No orders found");
      return null;
    }

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch user data for each order
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const userRef = db.collection("users").doc(order.userId);
        const userSnap = await userRef.get();
        const userData = userSnap.exists ? userSnap.data() : null;

        return {
          ...order,
          user: userData,
        };
      })
    );

    return enrichedOrders;
  } catch (error) {
    console.error("Error fetching orders with user info:", error);
    return null;
  }
}

export async function getAllPacks(): Promise<Packs[]> {
  const snapshot = await db.collection("packs")
 .orderBy("createdAt", "desc")
  .get();

  if (snapshot.empty) return [];

  const packs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Packs[];

  return packs;
}

export async function signinUser(params: SignInUser) {
  const { email, password } = params;

  try {
    const snapshot = await db
      .collection("admin")
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return {
      success: true,
      message: "Signed in successfully.",
      user: {
        id: userDoc.id,
        ...userData,
      },
    };

  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

export async function getUserDetails(params: { userId: string }) {
  const { userId } = params;

  try {
    const doc = await db.collection("admin").doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    return [{ id: doc.id, ...doc.data() }]; // wrap in array to keep your usage same
  } catch (error) {
    console.error(`Error fetching details of user ${userId}:`, error);
    return null;
  }
}


export async function updatePlanDetails({
         packid,
          name,
          packs,
          perInterview,
          price,
          offer,
          description,
          flag
}: {
  packid: string;
  name?: string;
  packs?: string;
  perInterview?: string;
  price?: string;
  offer?: string;
  description?: string;
  flag?: boolean;
}) {
  try {
    const userRef = db.collection("packs").doc(packid);

    await userRef.update({
      amount:price,
      desc:description,
      flag:flag,
      name:name,
      perInterview:perInterview,
      offer:offer,
      packs:packs,
      updatedAt:new Date().toISOString()
    });

    return { success: true, message: "Plan details updated successfully!" };
  } catch (error) {
    console.error("Error updating Plan details:", error);
    return { success: false, error };
  }
}


export async function checkPlanActive(params: Packs) {
  const {packid, name, flag } = params;

  try {
    const snapshot = await db
      .collection("packs")
      .where("name", "==", name)
      .where("flag", "==", flag)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: "No plan found",
      };
    }
    const otherPlans = snapshot.docs.filter(doc => doc.id !== packid);

    if (otherPlans.length === 0) {
      return {
        success: false,
        message: "No plan found",
      };
    }

    return {
      success: true,
      message: "Plan(s) found",
      data: otherPlans.map(doc => ({ id: doc.id, ...doc.data() })),
    };
  

  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Failed to get details. Please try again.",
    };
  }
}


export async function checkPlanExists(params: Packs) {
  const { name, flag } = params;

  try {
    const snapshot = await db
      .collection("packs")
      .where("name", "==", name)
      .where("flag", "==", flag)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: "No plan found",
      };
    }

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: "Plan(s) found",
      data,
    };

  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Failed to get details. Please try again.",
    };
  }
}

export async function AddNewPlan({
  name,
  packs,
  perInterview,
  price,
  offer,
  description,
  flag
}: {
  name?: string;
  packs?: string;
  perInterview?: string;
  price?: string;
  offer?: string;
  description?: string;
  flag?: boolean;
}) {
  try {
    await db.collection("packs").add({
      amount: price,
      desc: description,
      flag: flag,
      perInterview: perInterview,
      name: name,
      offer: offer,
      packs: packs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: "New plan added successfully!" };
  } catch (error) {
    console.error("Error adding new Plan:", error);
    return { success: false, error };
  }
}

export async function updateAdminProfile({
       userId,
            companyName,
            email,
            phone,
            bio,
            linkedln,
            facebook,
            twitter,
            insta
}: {
  userId: string;
  companyName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  linkedln?: string;
  facebook?: string;
  twitter?: string;
  insta?: string;

}) {
  try {
    const userRef = db.collection("admin").doc(userId);

    await userRef.update({
            companyName:companyName,
            email:email,
            phone:phone,
            bio:bio,
            linkedin:linkedln,
            facebook:facebook,
            twitter:twitter,
            instagram:insta
    });

    return { success: true, message: "Information updated successfully!" };
  } catch (error) {
    console.error("Error updatingInformation details:", error);
    return { success: false, error };
  }
}
