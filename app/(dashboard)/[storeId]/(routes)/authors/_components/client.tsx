"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AuthorColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface AuthorClientProps {
  data: AuthorColumns[];
}

export const AuthorClient = ({ data }: AuthorClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Authors (${data.length})`}
          description="Manage authors for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/authors/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for authors" />
      <Separator />
      <ApiList entityName="authors" entityNameId="authorId" />
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
// import { AuthorColumns, columns } from "./columns";
// import ApiList from "@/components/api-list";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface AuthorClientProps {
//   data: AuthorColumns[];
// }

// export const AuthorClient = ({ data }: AuthorClientProps) => {
//   const router = useRouter();
//   const params = useParams();

//   // Fetch data dynamically from Supabase (optional)
//   const fetchData = async () => {
//     const { data: authors, error } = await supabase.from("authors").select("*");
//     if (error) {
//       console.error("Error fetching authors:", error.message);
//       return [];
//     }
//     return authors;
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title={`Authors (${data.length})`}
//           description="Manage authors for your store"
//         />
//         <Button
//           onClick={() => router.push(`/${params.storeId}/authors/create`)}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add New
//         </Button>
//       </div>

//       <Separator />
//       {/* DataTable expects dynamic data from Supabase */}
//       <DataTable searchKey="name" columns={columns} data={data} />

//       <Heading title="API" description="API calls for authors" />
//       <Separator />
//       <ApiList entityName="authors" entityNameId="authorId" />
//     </>
//   );
// };
