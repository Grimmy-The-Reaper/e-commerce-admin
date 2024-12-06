import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

interface DashboardOverviewProps {
    params: {storeId: string};
}

const DashboardOverview = async ({params}: DashboardOverviewProps) => {
    const store = (await getDoc(doc(db, "stores", params.storeId))).data() as Store;
    return (<div>Overview : {store?.name || "Store name is not available"} </div> );
}
 
export default DashboardOverview;

// import { supabase } from "@/lib/supabaseClient"; // Supabase client initialization
// import { Store } from "@/types-db";

// interface DashboardOverviewProps {
//   params: { storeId: string };
// }

// const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
//   // Fetch store data from Supabase
//   const { data: store, error } = await supabase
//     .from("stores")
//     .select("name")
//     .eq("id", params.storeId)
//     .single();

//   if (error) {
//     console.error("Error fetching store:", error.message);
//   }

//   return (
//     <div>
//       Overview: {store?.name || "Store name is not available"}
//     </div>
//   );
// };

// export default DashboardOverview;
