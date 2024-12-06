import { db } from "@/lib/firebase";
import { Author } from "@/types-db";
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

    const authorData = {
      name,
      billboardId,
      billboardLabel,
      createdAt: serverTimestamp(),
    };

    const authorRef = await addDoc(
      collection(db, "stores", params.storeId, "authors"),
      authorData
    );

    const id = authorRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "authors", id), {
      ...authorData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...authorData });
  } catch (error) {
    console.log(`AUTHORS_POST:${error}`);
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

    const authorsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "authors"))
    ).docs.map((doc) => doc.data()) as Author[];

    return NextResponse.json(authorsData);
  } catch (error) {
    console.log(`AUTHORS_GET:${error}`);
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
//     const { name, billboardLabel, billboardId } = body;

//     if (!name) {
//       return new NextResponse("Author Name is missing!", { status: 400 });
//     }

//     if (!billboardId) {
//       return new NextResponse("Billboard is missing!", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
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

//     // Insert author data into the authors table
//     const { data: author, error: authorError } = await supabase
//       .from("authors")
//       .insert([
//         {
//           name,
//           billboardId,
//           billboardLabel,
//           storeId: params.storeId,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ])
//       .single();

//     if (authorError) {
//       return new NextResponse("Failed to create author", { status: 500 });
//     }

//     return NextResponse.json(author);
//   } catch (error) {
//     console.log(`AUTHORS_POST:${error}`);
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

//     // Fetch all authors for the store
//     const { data: authors, error } = await supabase
//       .from("authors")
//       .select("*")
//       .eq("storeId", params.storeId);

//     if (error) {
//       console.error(`AUTHORS_GET:${error}`);
//       return new NextResponse("Internal Server Error", { status: 500 });
//     }

//     return NextResponse.json(authors);
//   } catch (error) {
//     console.log(`AUTHORS_GET:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
