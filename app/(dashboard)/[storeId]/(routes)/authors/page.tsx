import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { AuthorClient } from "./_components/client";
import { Author } from "@/types-db";
import { AuthorColumns } from "./_components/columns";

const AuthorsPage = async ({ params }: { params: { storeId: string } }) => {
  const authorsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "authors"))
  ).docs.map((doc) => doc.data()) as Author[];

  console.log(authorsData)
  console.log("Firestore Data:", authorsData);
console.log("Params.storeId:", params.storeId);


  const formattedAuthors: AuthorColumns[] = authorsData.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboardLabel,
    createdAt: item.createdAt
      ? format(new Date(item.createdAt.seconds * 1000), "MMMM do, yyyy") // Convert Firestore Timestamp
      : "",
    updatedAt: item.updatedAt
      ? format(new Date(item.updatedAt.seconds * 1000), "MMMM do, yyyy") // Convert Firestore Timestamp
      : "",
  }));

  

  // console.log("Hello World");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AuthorClient data={formattedAuthors} />
      </div>
    </div>
  );
};

export default AuthorsPage;

// import { createClient } from "@supabase/supabase-js";
// import { format } from "date-fns";

// import { AuthorClient } from "./_components/client";
// import { Author } from "@/types-db";
// import { AuthorColumns } from "./_components/columns";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const AuthorsPage = async ({ params }: { params: { storeId: string } }) => {
//   // Fetch authors data for the specified store
//   const { data: authorsData, error } = await supabase
//     .from("authors")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (error) {
//     console.error(error);
//     return <div>Error loading authors data</div>;
//   }

//   const formattedAuthors: AuthorColumns[] = (authorsData || []).map((item) => ({
//     id: item.id,
//     name: item.name,
//     billboardLabel: item.billboardLabel,
//     createdAt: item.created_at
//       ? format(new Date(item.created_at), "MMMM do, yyyy")
//       : "",
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <AuthorClient data={formattedAuthors} />
//       </div>
//     </div>
//   );
// };

// export default AuthorsPage;
