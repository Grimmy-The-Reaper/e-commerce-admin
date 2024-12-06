import { db } from "@/lib/firebase";
import { Book } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      author,
      genre,
    } = body;

    if (!name) {
      return new NextResponse("Genre Name is missing!", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required!", { status: 400 });
    }

    if (!author) {
      return new NextResponse("Author is missing!", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is missing!", { status: 400 });
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

    const bookData = {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      author,
      genre,
      createdAt: serverTimestamp(),
    };

    const bookRef = await addDoc(
      collection(db, "stores", params.storeId, "books"),
      bookData
    );

    const id = bookRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "books", id), {
      ...bookData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...bookData });
  } catch (error) {
    console.log(`BOOKS_POST:${error}`);
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

    // get the searchParams from the req.url
    const { searchParams } = new URL(req.url);

    const bookRef = collection(
      doc(db, "stores", params.storeId),
      "books"
    );

    let bookQuery;

    let queryContraints = [];

    // construct the query based on the searchParameters
    if (searchParams.has("genre")) {
      queryContraints.push(where("genre", "==", searchParams.get("genre")));
    }

    if (searchParams.has("author")) {
      queryContraints.push(
        where("author", "==", searchParams.get("author"))
      );
    }

    if (searchParams.has("isFeatured")) {
      queryContraints.push(
        where(
          "isFeatured",
          "==",
          searchParams.get("isFeatured") === "true" ? true : false
        )
      );
    }

    if (searchParams.has("isArchived")) {
      queryContraints.push(
        where(
          "isArchived",
          "==",
          searchParams.get("isArchived") === "true" ? true : false
        )
      );
    }

    if (queryContraints.length > 0) {
      bookQuery = query(bookRef, and(...queryContraints));
    } else {
      bookQuery = query(bookRef);
    }

    // execute the query

    const querySnapshot = await getDocs(bookQuery);

    const bookData: Book[] = querySnapshot.docs.map(
      (doc) => doc.data() as Book
    );

    return NextResponse.json(bookData);
  } catch (error) {
    console.log(`BOOKS_GET:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // POST Request (Create Book and Upload Image)
// export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     const { name, price, images, isFeatured, isArchived, author, genre } = body;

//     if (!name || !price || !author || !images || !images.length) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     // 1. Upload images to Supabase Storage
//     const uploadedImages = [];
//     for (let i = 0; i < images.length; i++) {
//       // Upload images to Supabase Storage and get the public URL
//       const { data, error } = await supabase.storage
//       .from("book-images") // specify your storage bucket
//       .upload(images[i].name, images[i]); // assuming images[i] is a file object

//       if (error) {
//       console.error("Error uploading image:", error);
//       return new NextResponse("Image upload failed", { status: 500 });
//       }

//       // Correct way to access the public URL
//       const publicUrl = supabase.storage.from("book-images").getPublicUrl(data.path).publicUrl;

//       uploadedImages.push({ url: publicUrl });
//     }

//     // 2. Insert book into Supabase Database
//     const { data: bookData, error: insertError } = await supabase
//       .from("books") // Replace with your actual table name
//       .insert([
//         {
//           store_id: params.storeId,
//           name,
//           price,
//           images: uploadedImages,
//           isFeatured,
//           isArchived,
//           author,
//           genre,
//           created_at: new Date(),
//         },
//       ]);

//     if (insertError) {
//       console.error("Error inserting book:", insertError);
//       return new NextResponse("Error creating book", { status: 500 });
//     }

//     return NextResponse.json(bookData[0]);
//   } catch (error) {
//     console.error("BOOK POST Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// // GET Request (Fetch Books with Search Parameters)
// export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     const { searchParams } = new URL(req.url);
//     const queryConstraints = [];

//     // Add filters for genre, author, featured, and archived
//     if (searchParams.has("genre")) {
//       queryConstraints.push({ genre: searchParams.get("genre") });
//     }

//     if (searchParams.has("author")) {
//       queryConstraints.push({ author: searchParams.get("author") });
//     }

//     if (searchParams.has("isFeatured")) {
//       queryConstraints.push({
//         isFeatured: searchParams.get("isFeatured") === "true" ? true : false,
//       });
//     }

//     if (searchParams.has("isArchived")) {
//       queryConstraints.push({
//         isArchived: searchParams.get("isArchived") === "true" ? true : false,
//       });
//     }

//     // Query Supabase for books with the constraints
//     const { data, error } = await supabase
//       .from("books") // Replace with your actual table name
//       .select("*")
//       .eq("store_id", params.storeId)
//       .filter(queryConstraints)
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching books:", error);
//       return new NextResponse("Error fetching books", { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("BOOKS GET Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// // DELETE Request (Delete Book and Associated Images)
// export const DELETE = async (req: Request, { params }: { params: { storeId: string; bookId: string } }) => {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 400 });
//     }

//     if (!params.storeId || !params.bookId) {
//       return new NextResponse("Store ID or Book ID is missing", { status: 400 });
//     }

//     // 1. Fetch the book from Supabase
//     const { data: book, error: fetchError } = await supabase
//       .from("books") // Replace with your actual table name
//       .select("images")
//       .eq("store_id", params.storeId)
//       .eq("id", params.bookId)
//       .single();

//     if (fetchError) {
//       console.error("Error fetching book:", fetchError);
//       return new NextResponse("Book not found", { status: 404 });
//     }

//     // 2. Delete images from Supabase Storage
//     if (book.images && Array.isArray(book.images)) {
//       await Promise.all(
//         book.images.map(async (image: { url: string }) => {
//           const { error: deleteError } = await supabase
//             .storage
//             .from("book-images")
//             .remove([image.url]);

//           if (deleteError) {
//             console.error("Error deleting image:", deleteError);
//           }
//         })
//       );
//     }

//     // 3. Delete book record from the database
//     const { error: deleteError } = await supabase
//       .from("books")
//       .delete()
//       .eq("store_id", params.storeId)
//       .eq("id", params.bookId);

//     if (deleteError) {
//       console.error("Error deleting book:", deleteError);
//       return new NextResponse("Error deleting book", { status: 500 });
//     }

//     return NextResponse.json({ msg: "Book and associated images deleted successfully" });
//   } catch (error) {
//     console.error("BOOK DELETE Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };


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

//     const { name, price, images, isFeatured, isArchived, author, genre } = body;

//     // Validate required fields
//     if (!name || !price || !author || !images || !images.length) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store ID is missing", { status: 400 });
//     }

//     // Check if the store exists and belongs to the user
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("*")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     if (store.user_id !== userId) {
//       return new NextResponse("Unauthorized access", { status: 403 });
//     }

//     // Insert book into Supabase
//     const { data: book, error: bookError } = await supabase
//       .from("books")
//       .insert([
//         {
//           store_id: params.storeId,
//           name,
//           price,
//           images,
//           isFeatured,
//           isArchived,
//           author,
//           genre,
//           created_at: new Date(),
//         },
//       ])
//       .select()
//       .single();

//     if (bookError) {
//       console.error("Error inserting book:", bookError);
//       return new NextResponse("Error creating book", { status: 500 });
//     }

//     return NextResponse.json(book);
//   } catch (error) {
//     console.error(`BOOKS_POST Error: ${error}`);
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

//     // Parse search parameters from request URL
//     const { searchParams } = new URL(req.url);

//     let filters: Record<string, any> = { store_id: params.storeId };

//     // Add filters based on query parameters
//     if (searchParams.has("genre")) {
//       filters.genre = searchParams.get("genre");
//     }

//     if (searchParams.has("author")) {
//       filters.author = searchParams.get("author");
//     }

//     if (searchParams.has("isFeatured")) {
//       filters.isFeatured = searchParams.get("isFeatured") === "true";
//     }

//     if (searchParams.has("isArchived")) {
//       filters.isArchived = searchParams.get("isArchived") === "true";
//     }

//     // Fetch books from Supabase
//     const { data: books, error } = await supabase
//       .from("books")
//       .select("*")
//       .match(filters);

//     if (error) {
//       console.error("Error fetching books:", error);
//       return new NextResponse("Error fetching books", { status: 500 });
//     }

//     return NextResponse.json(books);
//   } catch (error) {
//     console.error(`BOOKS_GET Error: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
