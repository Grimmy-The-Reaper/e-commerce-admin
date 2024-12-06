"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BookColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface BookClientProps {
  data: BookColumns[];
}

export const BookClient = ({ data }: BookClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Books (${data.length})`}
          description="Manage books for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/books/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for books" />
      <Separator />
      <ApiList entityName="books" entityNameId="bookId" />
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
// import { BookColumns, columns } from "./columns";
// import ApiList from "@/components/api-list";
// import { createClient } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";

// // Supabase client setup
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface BookClientProps {
//   data: BookColumns[];
// }

// export const BookClient = ({ data }: BookClientProps) => {
//   const router = useRouter();
//   const params = useParams();
//   const [books, setBooks] = useState<BookColumns[]>([]);

//   // Fetch books data from Supabase
//   const fetchBooks = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("books")
//         .select("*")
//         .eq("store_id", params.storeId);

//       if (error) throw error;

//       setBooks(data as BookColumns[]);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, [params.storeId]);

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title={`Books (${books.length})`}
//           description="Manage books for your store"
//         />
//         <Button
//           onClick={() => router.push(`/${params.storeId}/books/create`)}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add New
//         </Button>
//       </div>

//       <Separator />
//       <DataTable searchKey="name" columns={columns} data={books} />

//       <Heading title="API" description="API calls for books" />
//       <Separator />
//       <ApiList entityName="books" entityNameId="bookId" />
//     </>
//   );
// };
