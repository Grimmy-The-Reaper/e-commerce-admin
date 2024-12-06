import { db } from "@/lib/firebase";
import { Billboards, Author } from "@/types-db";
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
  { params }: { params: { storeId: string; authorId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const { name, billboardLabel, billboardId } = body;

    if (!name) {
      return new NextResponse("Author Name is missing!", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard is missing!", { status: 400 });
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

    const authorRef = await getDoc(
      doc(db, "stores", params.storeId, "authors", params.authorId)
    );

    if (authorRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "authors", params.authorId),
        {
          ...authorRef.data(),
          name,
          billboardId,
          billboardLabel,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Author Data Not Found", { status: 404 });
    }

    const author = (
      await getDoc(
        doc(db, "stores", params.storeId, "authors", params.authorId)
      )
    ).data() as Author;

    return NextResponse.json(author);
  } catch (error) {
    console.log(`AUTHOR_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; authorId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.authorId) {
      return new NextResponse("Author Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const authorRef = doc(
      db,
      "stores",
      params.storeId,
      "authors",
      params.authorId
    );

    await deleteDoc(authorRef);

    return NextResponse.json({ msg: "Author Data Deleted" });
  } catch (error) {
    console.log(`AUTHORS_DELETE:${error}`);
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
//   { params }: { params: { storeId: string; authorId: string } }
// ) => {
//   try {
//     // Get current user from Supabase
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     const { name, billboardLabel, billboardId } = body;

//     if (!name) {
//       return new NextResponse("Author Name is missing!", { status: 400 });
//     }

//     if (!billboardId) {
//       return new NextResponse("Billboard is missing!", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing!", { status: 400 });
//     }

//     // Validate store ownership
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

//     // Update the author
//     const { data: author, error: authorError } = await supabase
//       .from("authors")
//       .update({
//         name,
//         billboardId,
//         billboardLabel,
//         updatedAt: new Date(),
//       })
//       .eq("id", params.authorId)
//       .eq("storeId", params.storeId)
//       .select("*")
//       .single();

//     if (authorError || !author) {
//       return new NextResponse("Author not found", { status: 404 });
//     }

//     return NextResponse.json(author);
//   } catch (error) {
//     console.error(`AUTHOR_PATCH: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const DELETE = async (
//   req: Request,
//   { params }: { params: { storeId: string; authorId: string } }
// ) => {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing!", { status: 400 });
//     }

//     if (!params.authorId) {
//       return new NextResponse("Author ID is missing!", { status: 400 });
//     }

//     // Validate store ownership
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

//     // Delete the author
//     const { error: deleteError } = await supabase
//       .from("authors")
//       .delete()
//       .eq("id", params.authorId)
//       .eq("storeId", params.storeId);

//     if (deleteError) {
//       return new NextResponse("Failed to delete author", { status: 500 });
//     }

//     return NextResponse.json({ message: "Author successfully deleted" });
//   } catch (error) {
//     console.error(`AUTHORS_DELETE: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
