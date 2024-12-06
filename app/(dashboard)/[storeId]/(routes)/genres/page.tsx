import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { GenresClient } from "./_components/client";
import { Genre} from "@/types-db";
import { GenreColumns } from "./_components/columns";

const GenresPage = async ({ params }: { params: { storeId: string } }) => {
  const genresData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "genres"))
  ).docs.map((doc) => doc.data()) as Genre[];

  const formattedGenres: GenreColumns[] = genresData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GenresClient data={formattedGenres} />
      </div>
    </div>
  );
};

export default GenresPage;


// import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client
// import { format } from "date-fns";
// import { GenresClient } from "./_components/client";
// import { Genre } from "@/types-db";
// import { GenreColumns } from "./_components/columns";

// const GenresPage = async ({ params }: { params: { storeId: string } }) => {
//   // Fetch genres from Supabase
//   const { data: genresData, error } = await supabase
//     .from("genres") // Assuming your Supabase table is named "genres"
//     .select("*")
//     .eq("store_id", params.storeId); // Filter by storeId

//   if (error) {
//     console.error("Error fetching genres:", error);
//     return <div>Error loading genres</div>;
//   }

//   // Format the fetched data
//   const formattedGenres: GenreColumns[] = genresData.map((item) => ({
//     id: item.id,
//     name: item.name,
//     value: item.value,
//     createdAt: item.created_at ? new Date(item.created_at) : new Date(), // Convert to Date object
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <GenresClient data={formattedGenres} />
//       </div>
//     </div>
//   );
// };

// export default GenresPage;
