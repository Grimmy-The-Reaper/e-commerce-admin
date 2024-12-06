import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
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
  { params }: { params: { storeId: string; billboardId: string } }
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

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const billboardRef = await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    );

    if (billboardRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId),
        {
          ...billboardRef.data(),
          label,
          imageUrl,
          // updatedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),

        }
      );
    } else {
      return new NextResponse("Billboard Not Found", { status: 404 });
    }

    const billboard = (
      await getDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId)
      )
    ).data() as Billboards;

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const billboardRef = doc(
      db,
      "stores",
      params.storeId,
      "billboards",
      params.billboardId
    );

    await deleteDoc(billboardRef);

    return NextResponse.json({ msg: "Billboard deleted successfully" });
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

// export const PATCH = async (
//   req: Request,
//   { params }: { params: { storeId: string; billboardId: string } }
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

//     if (!params.storeId || !params.billboardId) {
//       return new NextResponse("Store Id or Billboard Id is missing", { status: 400 });
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

//     // Update the billboard details
//     const { data: updatedBillboard, error: updateError } = await supabase
//       .from("billboards")
//       .update({
//         label,
//         imageUrl,
//         updatedAt: new Date(),
//       })
//       .eq("id", params.billboardId)
//       .eq("storeId", params.storeId)
//       .single();

//     if (updateError || !updatedBillboard) {
//       return new NextResponse("Billboard update failed", { status: 500 });
//     }

//     return NextResponse.json(updatedBillboard);
//   } catch (error) {
//     console.log(`STORES_PATCH:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const DELETE = async (
//   req: Request,
//   { params }: { params: { storeId: string; billboardId: string } }
// ) => {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     if (!params.storeId || !params.billboardId) {
//       return new NextResponse("Store Id or Billboard Id is missing", { status: 400 });
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

//     // Delete the billboard
//     const { error: deleteError } = await supabase
//       .from("billboards")
//       .delete()
//       .eq("id", params.billboardId)
//       .eq("storeId", params.storeId);

//     if (deleteError) {
//       return new NextResponse("Billboard deletion failed", { status: 500 });
//     }

//     return NextResponse.json({ msg: "Billboard deleted successfully" });
//   } catch (error) {
//     console.log(`STORES_DELETE:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
