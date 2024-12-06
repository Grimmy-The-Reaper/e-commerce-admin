import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { BookClient } from "./_components/client";
import { Book } from "@/types-db";
import { BookColumns } from "./_components/columns";
import { formatter } from "@/lib/utils";

const BooksPage = async ({ params }: { params: { storeId: string } }) => {
  const booksData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "books"))
  ).docs.map((doc) => doc.data()) as Book[];

  const formattedBooks: BookColumns[] = booksData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    author: item.author,
    genre: item.genre,
    images: item.images,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
    
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookClient data={formattedBooks} />
      </div>
    </div>
  );
};

export default BooksPage;

// import { supabase } from "@/lib/supabaseClient";  // Import Supabase client
// import { format } from "date-fns";
// import { BookClient } from "./_components/client";
// import { Book } from "@/types-db";
// import { BookColumns } from "./_components/columns";
// import { formatter } from "@/lib/utils";

// const BooksPage = async ({ params }: { params: { storeId: string } }) => {
//   // Fetch books data from Supabase
//   const { data: booksData, error } = await supabase
//     .from("books")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (error) {
//     console.error("Error fetching books:", error);
//     return <div>Error loading books</div>;
//   }

//   const formattedBooks: BookColumns[] = booksData.map((item) => ({
//     id: item.id,
//     name: item.name,
//     price: formatter.format(item.price),
//     isArchived: item.isArchived,
//     isFeatured: item.isFeatured,
//     author: item.author,
//     genre: item.genre,
//     images: item.images,
//     createdAt: item.created_at ? new Date(item.created_at) : new Date(), // Convert to Date object
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <BookClient data={formattedBooks} />
//       </div>
//     </div>
//   );
// };

// export default BooksPage;
