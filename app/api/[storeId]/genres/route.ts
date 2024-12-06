import { db } from "@/lib/firebase";
import { Genre } from "@/types-db";
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

    const genreData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const genreRef = await addDoc(
      collection(db, "stores", params.storeId, "genres"),
      genreData
    );

    const id = genreRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "genres", id), {
      ...genreData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...genreData });
  } catch (error) {
    console.log(`GENRES_POST:${error}`);
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

    const genresData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "genres"))
    ).docs.map((doc) => doc.data()) as Genre[];

    return NextResponse.json(genresData);
  } catch (error) {
    console.log(`GENRES_GET:${error}`);
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
