"use client";

import { Heading } from "@/components/heading";
import { AlertModel } from "@/components/model/alert-model";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";

import { Genre } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface GenreFormProps {
  initialData: Genre;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const GenreForm = ({ initialData }: GenreFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit genre" : "Create genre";
  const description = initialData ? "Edit a genre" : "Add a new genre";
  const toastMessage = initialData ? "Genre Updated" : "Genre Created";
  const action = initialData ? "Save Changes" : "Create genre";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/genres/${params.genreId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/genres`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/genres`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/genres/${params.genreId}`);

      toast.success("genre Removed");
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
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your genre name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your genre value..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};


// "use client";

// import { Heading } from "@/components/heading";
// import { AlertModel } from "@/components/model/alert-model";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// import { Separator } from "@/components/ui/separator";

// import { Genre } from "@/types-db";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Trash } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import { supabase } from "@/lib/supabaseClient"; // Make sure you have initialized Supabase client

// interface GenreFormProps {
//   initialData: Genre;
// }

// const formSchema = z.object({
//   name: z.string().min(1),
//   value: z.string().min(1),
// });

// export const GenreForm = ({ initialData }: GenreFormProps) => {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const params = useParams();
//   const router = useRouter();

//   const title = initialData ? "Edit genre" : "Create genre";
//   const description = initialData ? "Edit a genre" : "Add a new genre";
//   const toastMessage = initialData ? "Genre Updated" : "Genre Created";
//   const action = initialData ? "Save Changes" : "Create genre";

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       setIsLoading(true);
//       console.log(data);

//       if (initialData) {
//         // Update genre using Supabase
//         const { error } = await supabase
//           .from("genres")
//           .update(data)
//           .eq("id", initialData.id); // assuming "id" is the unique identifier

//         if (error) throw error;
//       } else {
//         // Insert new genre using Supabase
//         const { error } = await supabase
//           .from("genres")
//           .insert([{ ...data, store_id: params.storeId }]); // Add storeId for context if needed

//         if (error) throw error;
//       }

//       toast.success(toastMessage);
//       router.push(`/${params.storeId}/genres`);
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);

//       // Delete genre using Supabase
//       const { error } = await supabase
//         .from("genres")
//         .delete()
//         .eq("id", params.genreId); // assuming "id" is the unique identifier for genre

//       if (error) throw error;

//       toast.success("Genre Removed");
//       router.refresh();
//       router.push(`/${params.storeId}/genres`);
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
//       <div className="flex items-center justify-center">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={isLoading}
//             variant={"destructive"}
//             size={"icon"}
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <Separator />

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full space-y-8"
//         >
//           <div className="grid grid-cols-3 gap-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isLoading}
//                       placeholder="Your genre name..."
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="value"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Value</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isLoading}
//                       placeholder="Your genre value..."
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <Button disabled={isLoading} type="submit" size={"sm"}>
//             Save Changes
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };
