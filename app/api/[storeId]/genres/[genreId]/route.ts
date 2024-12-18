import { db } from "@/lib/firebase";
import { Billboards, Author, Genre } from "@/types-db";
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
  { params }: { params: { storeId: string; genreId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Genre Name is missing!", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Genre Value is missing!", { status: 400 });
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

    const genreRef = await getDoc(
      doc(db, "stores", params.storeId, "genres", params.genreId)
    );

    if (genreRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "genres", params.genreId),
        {
          ...genreRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Genre Not Found", { status: 404 });
    }

    const genre = (
      await getDoc(doc(db, "stores", params.storeId, "genres", params.genreId))
    ).data() as Genre;

    return NextResponse.json(genre);
  } catch (error) {
    console.log(`GENRE_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; genreId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.genreId) {
      return new NextResponse("Genre Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const genreRef = doc(db, "stores", params.storeId, "genres", params.genreId);

    await deleteDoc(genreRef);

    return NextResponse.json({ msg: "Genre Data Deleted" });
  } catch (error) {
    console.log(`GENRE_DELETE:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

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
