import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { BillboardForm } from "./_components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: {
    billboardId: string;
    storeId: string;
  };
}) => {
  const billboard = (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data() as Billboards;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;

// import { createClient } from "@supabase/supabase-js";
// import { Billboards } from "@/types-db";
// import { BillboardForm } from "./_components/billboard-form";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const BillboardPage = async ({
//   params,
// }: {
//   params: {
//     billboardId: string;
//     storeId: string;
//   };
// }) => {
//   const { data: billboard, error } = await supabase
//     .from("billboards")
//     .select("*")
//     .eq("id", params.billboardId)
//     .eq("store_id", params.storeId)
//     .single();

//   if (error) {
//     console.error("Failed to fetch billboard:", error);
//     return <div>Error loading billboard data.</div>;
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <BillboardForm initialData={billboard as Billboards} />
//       </div>
//     </div>
//   );
// };

// export default BillboardPage;
