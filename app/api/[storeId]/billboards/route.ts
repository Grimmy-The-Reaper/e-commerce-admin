import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Billboard Name is missing!", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Billboard Image is missing!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const billboardData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
    };

    const billboardRef = await addDoc(
      collection(db, "stores", params.storeId, "billboards"),
      billboardData
    );

    const id = billboardRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "billboards", id), {
      ...billboardData,
      id,
      // updatedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),

    });

    return NextResponse.json({ id, ...billboardData });
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const billboardsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
    ).docs.map((doc) => doc.data()) as Billboards[];

    return NextResponse.json(billboardsData);
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { createClient } from "@supabase/supabase-js";
// import { NextResponse } from "next/server";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export const POST = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     // Get the current authenticated user
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     const body = await req.json();
//     const { label, imageUrl } = body;

//     if (!label) {
//       return new NextResponse("Billboard Name is missing!", { status: 400 });
//     }

//     if (!imageUrl) {
//       return new NextResponse("Billboard Image is missing!", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store Id is missing", { status: 400 });
//     }

//     // Check if the store exists and validate ownership
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("userId")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     if (store.userId !== user.id) {
//       return new NextResponse("Unauthorized Access", { status: 403 });
//     }

//     // Insert the new billboard into the database
//     const { data: newBillboard, error: insertError } = await supabase
//       .from("billboards")
//       .insert([
//         {
//           storeId: params.storeId,
//           label,
//           imageUrl,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ])
//       .single();

//     if (insertError || !newBillboard) {
//       return new NextResponse("Error inserting billboard", { status: 500 });
//     }

//     return NextResponse.json(newBillboard);
//   } catch (error) {
//     console.log(`STORES_POST:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store Id is missing", { status: 400 });
//     }

//     // Get all billboards for the store
//     const { data: billboards, error } = await supabase
//       .from("billboards")
//       .select("*")
//       .eq("storeId", params.storeId);

//     if (error) {
//       return new NextResponse("Error fetching billboards", { status: 500 });
//     }

//     return NextResponse.json(billboards);
//   } catch (error) {
//     console.log(`STORES_GET:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
