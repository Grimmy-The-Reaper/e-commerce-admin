import { db, storage } from "@/lib/firebase";
import { Book, Genre } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; bookId: string } }
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
      return new NextResponse("Author Data is missing!", { status: 400 });
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

    const bookRef = await getDoc(
      doc(db, "stores", params.storeId, "books", params.bookId)
    );

    if (bookRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "books", params.bookId),
        {
          ...bookRef.data(),
          name,
          price,
          images,
          isFeatured,
          isArchived,
          author,
          genre,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Bobook Not Found", { status: 404 });
    }

    const book = (
      await getDoc(
        doc(db, "stores", params.storeId, "books", params.bookId)
      )
    ).data() as Book;

    return NextResponse.json(book);
  } catch (error) {
    console.log(`BOOK_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; bookId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.bookId) {
      return new NextResponse("Book Id missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const bookRef = doc(
      db,
      "stores",
      params.storeId,
      "books",
      params.bookId
    );

    const bookDoc = await getDoc(bookRef);
    if (!bookDoc.exists()) {
      return new NextResponse("Book Data not found!", { status: 404 });
    }

    // delete all the image from the storage
    const images = bookDoc.data()?.images;

    if (images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        })
      );
    }

    await deleteDoc(bookRef);

    return NextResponse.json({
      msg: "Book and asssociated images delete successfully",
    });
  } catch (error) {
    console.log(`BOOK_DELETE:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; bookId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.bookId) {
      return new NextResponse("Book Id is missing", { status: 400 });
    }

    const book = (
      await getDoc(
        doc(db, "stores", params.storeId, "books", params.bookId)
      )
    ).data() as Book;

    return NextResponse.json(book);
  } catch (error) {
    console.log(`BOOK_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient";  // Assuming you have a supabase client
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const PATCH = async (
//   req: Request,
//   { params }: { params: { storeId: string; bookId: string } }
// ) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Un-Authorized", { status: 400 });
//     }

//     const { name, price, images, isFeatured, isArchived, author, genre } = body;

//     if (!name || !price || !images || !images.length || !author) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     }

//     // Check if the store exists and belongs to the authenticated user
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("user_id")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || store?.user_id !== userId) {
//       return new NextResponse("Un-Authorized Access", { status: 400 });
//     }

//     // Check if the book exists in the store
//     const { data: book, error: bookError } = await supabase
//       .from("books")
//       .select("*")
//       .eq("store_id", params.storeId)
//       .eq("id", params.bookId)
//       .single();

//     if (bookError || !book) {
//       return new NextResponse("Book not found", { status: 404 });
//     }

//     // Update book details
//     const { error: updateError } = await supabase
//       .from("books")
//       .update({
//         name,
//         price,
//         images,
//         is_featured: isFeatured,
//         is_archived: isArchived,
//         author,
//         genre,
//         updated_at: new Date(),
//       })
//       .eq("id", params.bookId);

//     if (updateError) {
//       return new NextResponse("Failed to update book", { status: 500 });
//     }

//     // Retrieve the updated book and return it
//     const { data: updatedBook } = await supabase
//       .from("books")
//       .select("*")
//       .eq("id", params.bookId)
//       .single();

//     return NextResponse.json(updatedBook);
//   } catch (error) {
//     console.error(`BOOK_PATCH:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const DELETE = async (
//   req: Request,
//   { params }: { params: { storeId: string; bookId: string } }
// ) => {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Un-Authorized", { status: 400 });
//     }

//     if (!params.storeId || !params.bookId) {
//       return new NextResponse("Store or Book ID missing", { status: 400 });
//     }

//     // Check if the store exists and belongs to the authenticated user
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("user_id")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || store?.user_id !== userId) {
//       return new NextResponse("Un-Authorized Access", { status: 400 });
//     }

//     // Check if the book exists in the store
//     const { data: book, error: bookError } = await supabase
//       .from("books")
//       .select("*")
//       .eq("store_id", params.storeId)
//       .eq("id", params.bookId)
//       .single();

//     if (bookError || !book) {
//       return new NextResponse("Book not found", { status: 404 });
//     }

//     // Delete the book from the database
//     const { error: deleteError } = await supabase
//       .from("books")
//       .delete()
//       .eq("id", params.bookId);

//     if (deleteError) {
//       return new NextResponse("Failed to delete book", { status: 500 });
//     }

//     // If there are images associated with the book, delete them from Supabase storage
//     // if (book.images && Array.isArray(book.images)) {
//     //   await Promise.all(
//     //     book.images.map(async (imageUrl) => {
//     //       const { error: deleteStorageError } = await supabase.storage
//     //         .from("book-images")
//     //         .remove([imageUrl]);

//     //       if (deleteStorageError) {
//     //         console.error(`Error deleting image: ${deleteStorageError.message}`);
//     //       }
//     if (book.images && Array.isArray(book.images)) {
//       await Promise.all(
//         book.images.map(async (image: { url: string }) => {
//           const { error: deleteStorageError } = await supabase.storage
//             .from("book-images")
//             .remove([image.url]);
    
//           if (deleteStorageError) {
//             console.error(`Error deleting image: ${deleteStorageError.message}`);
//           }
//         })
//       );
//     }

//     return NextResponse.json({
//       msg: "Book and associated images deleted successfully",
//     });
//   } catch (error) {
//     console.error(`BOOK_DELETE:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string; bookId: string } }
// ) => {
//   try {
//     if (!params.storeId || !params.bookId) {
//       return new NextResponse("Store or Book ID missing", { status: 400 });
//     }

//     const { data: book, error } = await supabase
//       .from("books")
//       .select("*")
//       .eq("store_id", params.storeId)
//       .eq("id", params.bookId)
//       .single();

//     if (error || !book) {
//       return new NextResponse("Book not found", { status: 404 });
//     }

//     return NextResponse.json(book);
//   } catch (error) {
//     console.error(`BOOK_GET:${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
