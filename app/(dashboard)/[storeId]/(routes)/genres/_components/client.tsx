"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { GenreColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface GenresClientProps {
  data: GenreColumns[];
}

export const GenresClient = ({ data }: GenresClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Genres (${data.length})`}
          description="Manage genres for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/genres/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Genre
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for genres" />
      <Separator />
      <ApiList entityName="genres" entityNameId="genreId" />
    </>
  );
};


// "use client";

// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
// import { Separator } from "@/components/ui/separator";
// import { Plus } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { GenreColumns, columns } from "./columns";
// import ApiList from "@/components/api-list";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

// interface GenresClientProps {
//   data: GenreColumns[];
// }

// export const GenresClient = ({ data }: GenresClientProps) => {
//   const router = useRouter();
//   const params = useParams();

//   // State to hold genres data fetched from Supabase
//   const [genres, setGenres] = useState<GenreColumns[]>([]);

//   // Fetch genres data from Supabase
//   const fetchGenres = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("genres") // Assuming you have a 'genres' table
//         .select("*"); // Fetch all columns

//       if (error) throw error;

//       // Map the data into the GenreColumns format
//       const formattedGenres = data.map((genre: any) => ({
//         id: genre.id,
//         name: genre.name,
//         createdAt: genre.created_at, // Assuming created_at is the timestamp
//       }));

//       setGenres(formattedGenres);
//     } catch (error) {
//       console.error("Error fetching genres:", error);
//     }
//   };

//   // UseEffect to fetch data on initial render
//   useEffect(() => {
//     fetchGenres();
//   }, []);

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title={`Genres (${genres.length})`}
//           description="Manage genres for your store"
//         />
//         <Button onClick={() => router.push(`/${params.storeId}/genres/create`)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add New
//         </Button>
//       </div>

//       <Separator />
//       <DataTable searchKey="name" columns={columns} data={genres} />

//       <Heading title="API" description="API calls for genres" />
//       <Separator />
//       <ApiList entityName="genres" entityNameId="genreId" />
//     </>
//   );
// };

// "use client";

// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
// import { Separator } from "@/components/ui/separator";
// import { Plus } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { GenreColumns, columns } from "./columns";
// import ApiList from "@/components/api-list";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

// interface GenresClientProps {
//   data: GenreColumns[];
// }

// export const GenresClient = ({ data }: GenresClientProps) => {
//   const router = useRouter();
//   const params = useParams();

//   // State to hold genres data fetched from Supabase
//   const [genres, setGenres] = useState<GenreColumns[]>([]);

//   // Fetch genres data from Supabase
//   const fetchGenres = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("genres") // Assuming you have a 'genres' table in Supabase
//         .select("*"); // Fetch all columns from genres table

//       if (error) throw error;

//       // Map the data into the GenreColumns format, including `value`
//       const formattedGenres = data.map((genre: any) => ({
//         id: genre.id,
//         name: genre.name,
//         value: genre.tag, // Assuming 'tag' is the field you want to use as value
//         createdAt: new Date(genre.created_at), // Convert created_at field to Date
//       }));

//       setGenres(formattedGenres); // Update state with the formatted genres data
//     } catch (error) {
//       console.error("Error fetching genres:", error);
//     }
//   };

//   // Fetch genres when component mounts
//   useEffect(() => {
//     fetchGenres();
//   }, []);

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title={`Genres (${genres.length})`}
//           description="Manage genres for your store"
//         />
//         <Button onClick={() => router.push(`/${params.storeId}/genres/create`)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add New
//         </Button>
//       </div>

//       <Separator />
//       <DataTable searchKey="name" columns={columns} data={genres} />

//       <Heading title="API" description="API calls for genres" />
//       <Separator />
//       <ApiList entityName="genres" entityNameId="genreId" />
//     </>
//   );
// };
