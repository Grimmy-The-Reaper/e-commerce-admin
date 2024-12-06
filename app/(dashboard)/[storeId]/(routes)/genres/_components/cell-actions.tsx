"use client";

import { useParams, useRouter } from "next/navigation";
import { GenreColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModel } from "@/components/model/alert-model";

interface CellActionProps {
  data: GenreColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Genre Id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/genres/${data.id}`);

      toast.success("Genre Removed");
      router.refresh();
      router.push(`/${params.storeId}/genres`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModel
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/genres/${data.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};


// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { GenreColumns } from "./columns";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
// import toast from "react-hot-toast";
// import { supabase } from "@/lib/supabaseClient";  // Import the Supabase client
// import { AlertModel } from "@/components/model/alert-model";

// interface CellActionProps {
//   data: GenreColumns;
// }

// export const CellAction = ({ data }: CellActionProps) => {
//   const router = useRouter();
//   const params = useParams();

//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const onCopy = (id: string) => {
//     navigator.clipboard.writeText(id);
//     toast.success("Genre Id copied to clipboard");
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);

//       // Delete the genre using Supabase
//       const { error } = await supabase
//         .from("genres")  // Assuming you have a "genres" table in Supabase
//         .delete()
//         .eq("id", data.id);

//       if (error) {
//         throw new Error(error.message);
//       }

//       toast.success("Genre Removed");
//       router.refresh();  // Refresh the page after deletion
//       router.push(`/${params.storeId}/genres`);  // Redirect to the genres page
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       <AlertModel
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onDelete}
//         loading={isLoading}
//       />
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="h-8 w-8 p-0" variant={"ghost"}>
//             <span className="sr-only">Open</span>
//             <MoreVertical className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem onClick={() => onCopy(data.id)}>
//             <Copy className="h-4 w-4 mr-2" />
//             Copy Id
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => router.push(`/${params.storeId}/genres/${data.id}`)}
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Update
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => setOpen(true)}>
//             <Trash className="h-4 w-4 mr-2" />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };

