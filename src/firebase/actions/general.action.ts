"use server";

import { db } from "../admin";
import { cookies } from "next/headers";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

// Get current admin details from session cookie
export async function getCurrentAdmin() {
  const cookieStore =await cookies();
  const adminId = cookieStore.get("admin_session")?.value;

  if (!adminId) return null;

  const adminDoc = await db.collection("admin").doc(adminId).get();
  if (!adminDoc.exists) return null;

  return { id: adminDoc.id, ...adminDoc.data() };
}

// Admin logout: clear the cookie
export async function adminLogout() {
  const cookieStore =await cookies();
  cookieStore.delete("admin_session");
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  coverImage?: string;
  finalized: boolean;
  candidates?: string[];  // <-- add here
}


// Add photoURL to your existing User interface
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified?: boolean;
  packs?:string;
  authProvider: string;
  createdAt: string;
}



interface SignInUser {
  email: string;
  idToken?: string;
  password: string;
}

interface OrderProps{
  id?: string;
   paymentid: string;//
  orderid:string;
  type:string;
  amount: string;//900 
  packs: string;//5
  paymentType:string;
  oldBalance:string;
  remaining:string;
  userId:string; //userid
  paymentDate: string;
 packType:string
  
}
interface CheckPlanActiveParams {
  packid: string;
  name: string;
  flag: boolean;
}

interface Packs{
  packid?:string;
  id:string;
  name:string;
  packs:string;
  amount:string;
  offer:string;
  desc:string;
  flag:boolean
  createdAt:string;
  updatedAt:string

}
interface PacksQuery {
  name: string;
  flag: boolean;
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      console.log("No users found");
      return []; // Return an empty array instead of null
    }

    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Also return empty array on error
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


export async function getOrdersWithUserInfo(): Promise<OrderProps[] | null> {
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
      ...(doc.data() as Omit<OrderProps, "id">),
    })) as OrderProps[];

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
 
    const cookieStore =await cookies();
      cookieStore.set("admin_session", userDoc.id, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });


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


export async function checkPlanActive(params: CheckPlanActiveParams) {
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


export async function checkPlanExists(params: PacksQuery) {
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
