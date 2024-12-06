import { db } from "@/lib/firebase";
import { Genre } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { GenreForm } from "./_components/genre-form";

const GenrePage = async ({
  params,
}: {
  params: {
    genreId: string;
    storeId: string;
  };
}) => {
  const genre = (
    await getDoc(doc(db, "stores", params.storeId, "genres", params.genreId))
  ).data() as Genre;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GenreForm initialData={genre} />
      </div>
    </div>
  );
};

export default GenrePage;


// import { supabase } from "@/lib/supabaseClient"; // Ensure Supabase client is initialized
// import { Genre } from "@/types-db";
// import { GenreForm } from "./_components/genre-form";

// const GenrePage = async ({
//   params,
// }: {
//   params: {
//     genreId: string;
//     storeId: string;
//   };
// }) => {
//   const { data: genre, error } = await supabase
//     .from("genres")
//     .select("*")
//     .eq("id", params.genreId)
//     .eq("store_id", params.storeId)
//     .single();

//   if (error || !genre) {
//     // Handle cases where the genre is not found
//     return (
//       <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           <p className="text-red-500">Genre not found.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <GenreForm initialData={genre as Genre} />
//       </div>
//     </div>
//   );
// };

// export default GenrePage;
