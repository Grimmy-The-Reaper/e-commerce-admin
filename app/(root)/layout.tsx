import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

interface SetupLayoutProp{
    children: React.ReactNode
}

const SetupLayout = async ({children} : SetupLayoutProp) => {
    const {userId} = auth();

    if (!userId) {
        redirect("/sign-in");
      }
    
      const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
      );

      let store = null as any;

      storeSnap.forEach((doc) => {
        store = doc.data() as Store
        return;
      });

      console.log(store);
    
      if(store){
        redirect(`/${store?.id}`);
      }

    return <div>{children}</div>;
};
 
export default SetupLayout;

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// interface SetupLayoutProps {
//   children: React.ReactNode;
// }

// const SetupLayout = async ({ children }: SetupLayoutProps) => {
//   // Initialize Supabase client
//   const supabase = createServerComponentClient({ cookies });

//   // Get authenticated user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/sign-in");
//   }

//   // Fetch the store associated with the user
//   const { data: stores, error } = await supabase
//     .from("stores")
//     .select("id")
//     .eq("user_id", user.id)
//     .limit(1);

//   if (error) {
//     console.error("Error fetching store:", error.message);
//   }

//   // If a store exists, redirect to the store's dashboard
//   if (stores && stores.length > 0) {
//     redirect(`/${stores[0].id}`);
//   }

//   // Render children if no store is found
//   return <div>{children}</div>;
// };

// export default SetupLayout;
