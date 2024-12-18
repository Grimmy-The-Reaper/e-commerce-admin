"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type BookColumns = {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  author: string;
  genre: string[];
  images: { url: string }[];
  createdAt: string;
};

export const columns: ColumnDef<BookColumns>[] = [
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
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "genre",
    header: "Genre"
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

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { CellAction } from "./cell-actions";

// // Supabase type for a book record
// export type BookColumns = {
//   id: string;
//   name: string;
//   price: string;
//   isFeatured: boolean;
//   isArchived: boolean;
//   author: string;
//   genre: string;
//   images: { url: string }[]; // Assuming a list of images
//   createdAt: Date; // This might be a Date object from Supabase, but for now, it can stay as a string
// };

// // Columns definition for the books table
// export const columns: ColumnDef<BookColumns>[] = [
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
//     accessorKey: "price",
//     header: "Price",
//   },
//   {
//     accessorKey: "isFeatured",
//     header: "Featured",
//     cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
//   },
//   {
//     accessorKey: "isArchived",
//     header: "Archived",
//     cell: ({ row }) => (row.original.isArchived ? "Yes" : "No"),
//   },
//   {
//     accessorKey: "author",
//     header: "Author",
//   },
//   {
//     accessorKey: "genre",
//     header: "Genre",
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
//     // Format the date for display if it's a string
//     cell: ({ row }) => {
//       const date = new Date(row.original.createdAt);
//       return date.toLocaleDateString(); // Use a specific date format if necessary
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <CellAction data={row.original} />,
//   },
// ];
