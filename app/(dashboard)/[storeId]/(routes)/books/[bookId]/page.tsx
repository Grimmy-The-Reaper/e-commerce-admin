import { db } from "@/lib/firebase";
import { Author, Book, Genre } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { BookForm } from "./_components/book-form";

const BookPage = async ({
  params,
}: {
  params: {
    bookId: string;
    storeId: string;
  };
}) => {
  const author = (
    await getDoc(
      doc(db, "stores", params.storeId, "authors", params.bookId)
    )
  ).data() as Book;

  const authorsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "authors"))
  ).docs.map((doc) => doc.data()) as Author[];

  const genreData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "genres"))
  ).docs.map((doc) => doc.data()) as Genre[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookForm
          initialData={author}
          authors={authorsData}
          genres={genreData}
        />
      </div>
    </div>
  );
};

export default BookPage;


// import { supabase } from "@/lib/supabaseClient";  // Import Supabase client
// import { Author, Book, Genre } from "@/types-db";
// import { BookForm } from "./_components/book-form";

// const BookPage = async ({
//   params,
// }: {
//   params: {
//     bookId: string;
//     storeId: string;
//   };
// }) => {
//   // Fetch the book details using supabase
//   const { data: bookData, error: bookError } = await supabase
//     .from("books")
//     .select("*")
//     .eq("id", params.bookId)
//     .eq("store_id", params.storeId)
//     .single();  // .single() ensures only one row is returned

//   if (bookError) {
//     console.error("Error fetching book:", bookError);
//     return <div>Error loading book data</div>;
//   }

//   // Fetch the authors list
//   const { data: authorsData, error: authorsError } = await supabase
//     .from("authors")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (authorsError) {
//     console.error("Error fetching authors:", authorsError);
//     return <div>Error loading authors</div>;
//   }

//   // Fetch the genres list
//   const { data: genreData, error: genreError } = await supabase
//     .from("genres")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (genreError) {
//     console.error("Error fetching genres:", genreError);
//     return <div>Error loading genres</div>;
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <BookForm
//           initialData={bookData}  // Pass the fetched book data to the form
//           authors={authorsData}    // Pass the authors data to the form
//           genres={genreData}       // Pass the genres data to the form
//         />
//       </div>
//     </div>
//   );
// };

// export default BookPage;
