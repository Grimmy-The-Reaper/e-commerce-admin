import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const ordersData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
    ).docs.map((doc) => doc.data()) as Order[];

    // Return the added document with its ID
    return NextResponse.json(ordersData);
  } catch (error) {
    console.log(`[ORDERS_GET] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// import { supabase } from "@/lib/supabaseClient"; // Supabase client import
// import { NextResponse } from "next/server";

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     // Ensure storeId is provided in the request params
//     if (!params.storeId) {
//       return new NextResponse("Store ID is required", { status: 400 });
//     }

//     // Fetch orders for the specified store from Supabase
//     const { data: ordersData, error } = await supabase
//       .from("orders") // Querying the 'orders' table in Supabase
//       .select("*") // Selecting all fields for the orders
//       .eq("store_id", params.storeId); // Filtering orders based on the store_id

//     // Handle errors from the database query
//     if (error) {
//       console.error(`[ORDERS_GET]: ${error.message}`);
//       return new NextResponse("Failed to fetch orders", { status: 500 });
//     }

//     // Return the fetched orders as JSON
//     return NextResponse.json(ordersData);
//   } catch (error) {
//     console.error(`[ORDERS_GET]: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
