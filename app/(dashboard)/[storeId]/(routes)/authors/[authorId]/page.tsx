import { db } from "@/lib/firebase";
import { Billboards, Author } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { AuthorForm } from "./_components/author-form";

const BillboardPage = async ({
  params,
}: {
  params: {
    authorId: string;
    storeId: string;
  };
}) => {
  const author = (
    await getDoc(
      doc(db, "stores", params.storeId, "authors", params.authorId)
    )
  ).data() as Author;

  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AuthorForm initialData={author} billboards={billboardsData} />
      </div>
    </div>
  );
};

export default BillboardPage;


// import { createClient } from "@supabase/supabase-js";
// import { Billboards, Author } from "@/types-db";
// import { AuthorForm } from "./_components/author-form";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const BillboardPage = async ({
//   params,
// }: {
//   params: {
//     authorId: string;
//     storeId: string;
//   };
// }) => {
//   // Fetch the author by ID
//   const { data: author, error: authorError } = await supabase
//     .from("authors")
//     .select("*")
//     .eq("id", params.authorId)
//     .single();

//   if (authorError) {
//     console.error(authorError);
//     return <div>Error loading author data</div>;
//   }

//   // Fetch all billboards for the store
//   const { data: billboardsData, error: billboardsError } = await supabase
//     .from("billboards")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (billboardsError) {
//     console.error(billboardsError);
//     return <div>Error loading billboard data</div>;
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <AuthorForm initialData={author as Author} billboards={billboardsData as Billboards[]} />
//       </div>
//     </div>
//   );
// };

// export default BillboardPage;
