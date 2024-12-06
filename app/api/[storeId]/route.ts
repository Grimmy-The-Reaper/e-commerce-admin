import { db, storage } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id Required", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Store Name missing!", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);
    await updateDoc(docRef, { name });
    const store = (await getDoc(docRef)).data() as Store;

    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORES_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    // TODO : Delete sabai subcollection haru and along those data file urls

    // billboards and its images
    const billboardsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );

    billboardsQuerySnapshot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);

      // remove the images from the storage
      const imageUrl = billboardDoc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // authors

    const authorsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/authors`)
    );

    authorsQuerySnapshot.forEach(async (authorDoc) => {
      await deleteDoc(authorDoc.ref);
    });

    // genre

    const genresQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/genres`)
    );

    genresQuerySnapshot.forEach(async (genreDoc) => {
      await deleteDoc(genreDoc.ref);
    });

    // books and its images
    const booksQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/books`)
    );

    booksQuerySnapshot.forEach(async (bookDoc) => {
      await deleteDoc(bookDoc.ref);

      // remove the images from the storage
      const imagesArray = bookDoc.data().images;
      if (imagesArray && Array.isArray(imagesArray)) {
        await Promise.all(
          imagesArray.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });

    //orders and its order items and its images
    const ordersQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    );

    ordersQuerySnapshot.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref);

      const ordersItemArray = orderDoc.data().orderItems;
      if (ordersItemArray && Array.isArray(ordersItemArray)) {
        await Promise.all(
          ordersItemArray.map(async (orderItem) => {
            const itemImagesArray = orderItem.images;
            if (itemImagesArray && Array.isArray(itemImagesArray)) {
              await Promise.all(
                itemImagesArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                })
              );
            }
          })
        );
      }
    });

    // finally deleting the store
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.log(`STORES_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
// import { Store } from "@/types-db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const PATCH = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     const { userId } = auth();
//     const body = await req.json();

//     if (!userId) {
//       return new NextResponse("Un-Authorized", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store Id Required", { status: 400 });
//     }

//     const { name } = body;

//     if (!name) {
//       return new NextResponse("Store Name missing!", { status: 400 });
//     }

//     // Check if store exists
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("*")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     // Update store name
//     const { error: updateError } = await supabase
//       .from("stores")
//       .update({ name })
//       .eq("id", params.storeId);

//     if (updateError) {
//       console.error(`Error updating store: ${updateError.message}`);
//       return new NextResponse("Failed to update store", { status: 500 });
//     }

//     // Fetch updated store
//     const { data: updatedStore, error: fetchError } = await supabase
//       .from("stores")
//       .select("*")
//       .eq("id", params.storeId)
//       .single();

//     if (fetchError || !updatedStore) {
//       return new NextResponse("Failed to fetch updated store", { status: 500 });
//     }

//     return NextResponse.json(updatedStore);
//   } catch (error) {
//     console.error(`STORES_PATCH: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const DELETE = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Un-Authorized", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store Id is Required", { status: 400 });
//     }

//     // Fetch the store
//     const { data: store, error: storeError } = await supabase
//       .from("stores")
//       .select("*")
//       .eq("id", params.storeId)
//       .single();

//     if (storeError || !store) {
//       return new NextResponse("Store not found", { status: 404 });
//     }

//     // Delete store sub-collections and related data
//     // Billboards
//     const { data: billboards, error: billboardsError } = await supabase
//       .from("billboards")
//       .select("id, image_url")
//       .eq("store_id", params.storeId);

//     if (billboardsError) {
//       console.error("Error fetching billboards:", billboardsError);
//       return new NextResponse("Failed to fetch billboards", { status: 500 });
//     }

//     for (const billboard of billboards) {
//       // Delete images from Supabase Storage
//       if (billboard.image_url) {
//         const { error: deleteImageError } = await supabase.storage
//           .from("images")
//           .remove([billboard.image_url]);

//         if (deleteImageError) {
//           console.error("Error deleting image:", deleteImageError);
//         }
//       }
//       // Delete the billboard record
//       await supabase.from("billboards").delete().eq("id", billboard.id);
//     }

//     // Authors
//     const { data: authors, error: authorsError } = await supabase
//       .from("authors")
//       .select("id")
//       .eq("store_id", params.storeId);

//     if (authorsError) {
//       console.error("Error fetching authors:", authorsError);
//       return new NextResponse("Failed to fetch authors", { status: 500 });
//     }

//     for (const author of authors) {
//       await supabase.from("authors").delete().eq("id", author.id);
//     }

//     // Genres
//     const { data: genres, error: genresError } = await supabase
//       .from("genres")
//       .select("id")
//       .eq("store_id", params.storeId);

//     if (genresError) {
//       console.error("Error fetching genres:", genresError);
//       return new NextResponse("Failed to fetch genres", { status: 500 });
//     }

//     for (const genre of genres) {
//       await supabase.from("genres").delete().eq("id", genre.id);
//     }

//     // Books
//     const { data: books, error: booksError } = await supabase
//       .from("books")
//       .select("id, images")
//       .eq("store_id", params.storeId);

//     if (booksError) {
//       console.error("Error fetching books:", booksError);
//       return new NextResponse("Failed to fetch books", { status: 500 });
//     }

//     for (const book of books) {
//       // Delete images from Supabase Storage
//       if (book.images && Array.isArray(book.images)) {
//         for (const image of book.images) {
//           const { error: deleteBookImageError } = await supabase.storage
//             .from("images")
//             .remove([image.url]);

//           if (deleteBookImageError) {
//             console.error("Error deleting book image:", deleteBookImageError);
//           }
//         }
//       }
//       await supabase.from("books").delete().eq("id", book.id);
//     }

//     // Orders
//     const { data: orders, error: ordersError } = await supabase
//       .from("orders")
//       .select("id, order_items")
//       .eq("store_id", params.storeId);

//     if (ordersError) {
//       console.error("Error fetching orders:", ordersError);
//       return new NextResponse("Failed to fetch orders", { status: 500 });
//     }

//     for (const order of orders) {
//       // Delete order items and images from Supabase Storage
//       if (order.order_items && Array.isArray(order.order_items)) {
//         for (const orderItem of order.order_items) {
//           if (orderItem.images && Array.isArray(orderItem.images)) {
//             for (const image of orderItem.images) {
//               const { error: deleteOrderImageError } = await supabase.storage
//                 .from("images")
//                 .remove([image.url]);

//               if (deleteOrderImageError) {
//                 console.error("Error deleting order image:", deleteOrderImageError);
//               }
//             }
//           }
//         }
//       }
//       await supabase.from("orders").delete().eq("id", order.id);
//     }

//     // Finally, delete the store
//     const { error: deleteStoreError } = await supabase
//       .from("stores")
//       .delete()
//       .eq("id", params.storeId);

//     if (deleteStoreError) {
//       console.error("Error deleting store:", deleteStoreError);
//       return new NextResponse("Failed to delete store", { status: 500 });
//     }

//     return NextResponse.json({
//       msg: "Store and all its sub-collections deleted",
//     });
//   } catch (error) {
//     console.error(`STORES_DELETE: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
