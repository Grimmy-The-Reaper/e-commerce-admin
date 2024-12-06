import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { auth } from "@clerk/nextjs/server";

import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const { order_status } = body;

    if (!order_status) {
      return new NextResponse("Order Status is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    const orderRef = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (orderRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "orders", params.orderId),
        {
          ...orderRef.data(),
          order_status,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Order Not Found", { status: 404 });
    }

    const order = (
      await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))
    ).data() as Order;

    return NextResponse.json(order);
  } catch (error) {
    console.log(`[STORE_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    const docRef = doc(db, "stores", params.storeId, "orders", params.orderId);

    await deleteDoc(docRef);

    return NextResponse.json({ msg: "Order Deleted" });
  } catch (error) {
    console.log(`[ORDER_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const POST = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     const { name, value } = body;

//     if (!name) {
//       return new NextResponse("Genre name is missing!", { status: 400 });
//     }

//     if (!value) {
//       return new NextResponse("Genre value is missing!", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     // Verify store ownership
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("user_id")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     if (store.user_id !== userId) {
//       return new NextResponse("Unauthorized access", { status: 403 });
//     }

//     // Insert new genre
//     const { data: newGenre, error: insertError } = await supabase
//       .from("genres")
//       .insert({
//         store_id: params.storeId,
//         name,
//         value,
//         created_at: new Date(),
//         updated_at: new Date(),
//       })
//       .select()
//       .single();

//     if (insertError) {
//       console.error("Error adding genre:", insertError);
//       return new NextResponse("Error adding genre", { status: 500 });
//     }

//     return NextResponse.json(newGenre);
//   } catch (error) {
//     console.error(`GENRES_POST Error: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     // Fetch genres for the given store ID
//     const { data: genres, error: fetchError } = await supabase
//       .from("genres")
//       .select("*")
//       .eq("store_id", params.storeId);

//     if (fetchError) {
//       console.error("Error fetching genres:", fetchError);
//       return new NextResponse("Error fetching genres", { status: 500 });
//     }

//     return NextResponse.json(genres);
//   } catch (error) {
//     console.error(`GENRES_GET Error: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const PATCH = async (
//   req: Request,
//   { params }: { params: { storeId: string; genreId: string } }
// ) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     const { name, value } = body;

//     if (!name) {
//       return new NextResponse("Genre name is missing!", { status: 400 });
//     }

//     if (!value) {
//       return new NextResponse("Genre value is missing!", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     // Verify store ownership
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("user_id")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     if (store.user_id !== userId) {
//       return new NextResponse("Unauthorized access", { status: 403 });
//     }

//     // Update the genre in Supabase
//     const { error: updateError } = await supabase
//       .from("genres")
//       .update({ name, value, updated_at: new Date() })
//       .eq("id", params.genreId)
//       .eq("store_id", params.storeId);

//     if (updateError) {
//       console.error("Error updating genre:", updateError);
//       return new NextResponse("Error updating genre", { status: 500 });
//     }

//     // Fetch the updated genre
//     const { data: genre, error: fetchError } = await supabase
//       .from("genres")
//       .select("*")
//       .eq("id", params.genreId)
//       .single();

//     if (fetchError || !genre) {
//       return new NextResponse("Genre not found after update", { status: 404 });
//     }

//     return NextResponse.json(genre);
//   } catch (error) {
//     console.error(`GENRE_PATCH Error: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const DELETE = async (
//   req: Request,
//   { params }: { params: { storeId: string; genreId: string } }
// ) => {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     if (!params.genreId) {
//       return new NextResponse("Genre ID is missing", { status: 400 });
//     }

//     // Verify store ownership
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("user_id")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     if (store.user_id !== userId) {
//       return new NextResponse("Unauthorized access", { status: 403 });
//     }

//     // Delete the genre from Supabase
//     const { error: deleteError } = await supabase
//       .from("genres")
//       .delete()
//       .eq("id", params.genreId)
//       .eq("store_id", params.storeId);

//     if (deleteError) {
//       console.error("Error deleting genre:", deleteError);
//       return new NextResponse("Error deleting genre", { status: 500 });
//     }

//     return NextResponse.json({ msg: "Genre deleted successfully" });
//   } catch (error) {
//     console.error(`GENRE_DELETE Error: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
