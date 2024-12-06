// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { CellAction } from "./cell-actions";

// export type AuthorColumns = {
//   id: string;
//   billboardLabel: string;
//   name: string;
//   createdAt: string;
// };

// export const columns: ColumnDef<AuthorColumns>[] = [
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Author
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "billboardLabel",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Billboard
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


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type AuthorColumns = {
  id: string; // Primary key in the authors table
  billboardLabel: string; // Related billboard or label data
  name: string; // Author's name
  createdAt: string; // Timestamp of creation
};

export const columns: ColumnDef<AuthorColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "billboardLabel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Billboard
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
