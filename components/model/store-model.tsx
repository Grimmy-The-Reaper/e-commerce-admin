"use client"

import { useStoreModel } from "@/hooks/use-store-model";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Model } from "@/components/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
    name : z.string().min(3, {message : "The name of the store should be a minimum of 3 characters"})
})


export const StoreModel = () => {
    const storeModel = useStoreModel()

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            name : ""
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try{
        setIsLoading(true)
        
        const response = await axios.post("api/stores",values);
        toast.success("Store created successfully")
        window.location.assign(`/${response.data.id}`);
        //window reload ------^
        }catch(error){
            toast.error("Something went wrong :( ");
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <Model title="Create a new book genre" description="Add a new genre to your store" isOpen= {storeModel.isOpen} onClose={storeModel.onClose}>
            <div>
                <div className="space-y-4 py-4 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name= "name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled = {isLoading}
                                            placeholder= "Your Store Name...."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled = {isLoading} type="button" variant={"outline"} size = {"sm"}>
                                    Cancel
                                </Button>
                                <Button disabled = {isLoading} type="submit" size={"sm"}>
                                    Continue
                                </Button>
                            </div>
                        </form>

                    </Form>
                </div>
            </div>
        </Model>

    )
}


// "use client";

// import { useStoreModel } from "@/hooks/use-store-model";
// import { z } from "zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { supabase } from "@/lib/supabaseClient"; // Ensure you configure the Supabase client
// import { Model } from "@/components/model";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";

// const formSchema = z.object({
//   name: z.string().min(3, { message: "The name of the store should be a minimum of 3 characters" }),
// });

// export const StoreModel = () => {
//   const storeModel = useStoreModel();

//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setIsLoading(true);

//       const { data, error } = await supabase
//         .from("stores")
//         .insert([{ name: values.name }])
//         .select();

//       if (error) {
//         throw error;
//       }

//       toast.success("Store created successfully");
//       if (data?.[0]?.id) {
//         window.location.assign(`/${data[0].id}`); // Navigate to the new store's page
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong :(");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Model
//       title="Create a new book genre"
//       description="Add a new genre to your store"
//       isOpen={storeModel.isOpen}
//       onClose={storeModel.onClose}
//     >
//       <div>
//         <div className="space-y-4 py-4 pb-4">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input
//                         disabled={isLoading}
//                         placeholder="Your Store Name..."
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="pt-6 space-x-2 flex items-center justify-end w-full">
//                 <Button
//                   disabled={isLoading}
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={storeModel.onClose}
//                 >
//                   Cancel
//                 </Button>
//                 <Button disabled={isLoading} type="submit" size="sm">
//                   Continue
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </Model>
//   );
// };
