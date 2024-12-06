"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type GenreColumns = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<GenreColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];


// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { CellAction } from "./cell-actions";
// import { DataTable } from "@/components/ui/data-table"; // Import DataTable

// // Define your GenreColumns type
// export type GenreColumns = {
//   id: string;
//   name: string;
//   value: string;
//   createdAt: Date;
// };

// export const columns: ColumnDef<GenreColumns>[] = [
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "value",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Tag
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Date
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <CellAction data={row.original} />,
//   },
// ];

// const GenresPage = () => {
//   const [genres, setGenres] = useState<GenreColumns[]>([]);

//   useEffect(() => {
//     const fetchGenres = async () => {
//       const { data, error } = await supabase
//         .from("genres") // Assuming you have a 'genres' table in Supabase
//         .select("id, name, value, createdAt")
//         .order("createdAt", { ascending: false }); // Optional: Ordering by date

//       if (error) {
//         console.error("Error fetching genres:", error.message);
//       } else {
//         // Convert createdAt to Date object if necessary
//         const formattedData = data?.map((genre) => ({
//           ...genre,
//           createdAt: new Date(genre.createdAt), // Convert to Date
//         }));

//         setGenres(formattedData || []);
//       }
//     };

//     fetchGenres();
//   }, []);

//   return (
//     <div>
//       <DataTable columns={columns} data={genres} searchKey="name" />
//     </div>
//   );
// };

// export default GenresPage;
