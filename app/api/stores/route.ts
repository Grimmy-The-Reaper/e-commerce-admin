import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Store Name is missing!", { status: 400 });
    }

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore and retrive its reference id
    const storeRef = await addDoc(collection(db, "stores"), storeData);

    // Get the reference ID
    const id = storeRef.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      // updatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...storeData });
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const POST = async (req: Request) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const { name } = body;

//     if (!name) {
//       return new NextResponse("Store Name is missing!", { status: 400 });
//     }

//     const storeData = {
//       name,
//       user_id: userId, // Assuming the column in the Supabase database is `user_id`
//       created_at: new Date().toISOString(), // Supabase-compatible timestamp
//       updated_at: new Date().toISOString(),
//     };

//     // Insert the store data into the "stores" table
//     const { data, error } = await supabase
//       .from("stores")
//       .insert(storeData)
//       .select()
//       .single();

//     if (error) {
//       console.error(`STORES_POST: ${error.message}`);
//       return new NextResponse("Failed to create store", { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error(`STORES_POST: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
