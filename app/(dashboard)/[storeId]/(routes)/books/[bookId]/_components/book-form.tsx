"use client";

import { Heading } from "@/components/heading";
import ImagesUpload from "@/components/images-upload";
import { AlertModel } from "@/components/model/alert-model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import { Book, Author, Genre} from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BookFormProps {
  initialData: Book;
  authors: Author[];
  genres: Genre[];
}

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  author: z.string().min(1),
  genre: z.string().min(1),
});

export const BookForm = ({
  initialData,
  authors,
  genres,
}: BookFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      author: "",
      genre: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit book data" : "Create book";
  const description = initialData ? "Edit book data" : "Add a new book";
  const toastMessage = initialData ? "Book Data Updated" : "Book Created";
  const action = initialData ? "Save Changes" : "Create Book";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/books/${params.bookId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/books`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/books`);
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

      await axios.delete(`/api/${params.storeId}/books/${params.bookId}`);

      toast.success("Book Removed");
      // router.refresh();
      location.reload();
      router.push(`/${params.storeId}/books`);
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
          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImagesUpload
                    value={field.value.map((image) => image.url)}
                    onChange={(urls) => {
                      field.onChange(urls.map((url) => ({ url })));
                    }}
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((current) => current.url !== url)
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
                      placeholder="Book name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an author"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.name}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a genre"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.name}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This book will be on the main page under featured books!
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not be displayed anywhere inside the
                      store
                    </FormDescription>
                  </div>
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
// import ImagesUpload from "@/components/images-upload";
// import { AlertModel } from "@/components/model/alert-model";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Separator } from "@/components/ui/separator";

// import { Book, Author, Genre } from "@/types-db";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Trash } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import { supabase } from "@/lib/supabaseClient";  // Import Supabase client

// interface BookFormProps {
//   initialData: Book;
//   authors: Author[];
//   genres: Genre[];
// }

// const formSchema = z.object({
//   name: z.string().min(1),
//   price: z.coerce.number().min(1),
//   images: z.object({ url: z.string() }).array(),
//   isFeatured: z.boolean().default(false).optional(),
//   isArchived: z.boolean().default(false).optional(),
//   author: z.string().min(1),
//   genre: z.string().min(1),
// });

// export const BookForm = ({
//   initialData,
//   authors,
//   genres,
// }: BookFormProps) => {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData || {
//       name: "",
//       price: 0,
//       images: [],
//       isFeatured: false,
//       isArchived: false,
//       author: "",
//       genre: "",
//     },
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const params = useParams();
//   const router = useRouter();

//   const title = initialData ? "Edit book data" : "Create book";
//   const description = initialData ? "Edit book data" : "Add a new book";
//   const toastMessage = initialData ? "Book Data Updated" : "Book Created";
//   const action = initialData ? "Save Changes" : "Create Book";

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       setIsLoading(true);
//       console.log(data);

//       if (initialData) {
//         // Update book
//         const { error } = await supabase
//           .from("books")
//           .update({
//             name: data.name,
//             price: data.price,
//             images: data.images,
//             isFeatured: data.isFeatured,
//             isArchived: data.isArchived,
//             author: data.author,
//             genre: data.genre,
//           })
//           .eq("id", params.bookId)
//           .eq("store_id", params.storeId);

//         if (error) throw error;
//       } else {
//         // Create new book
//         const { error } = await supabase
//           .from("books")
//           .insert([
//             {
//               name: data.name,
//               price: data.price,
//               images: data.images,
//               isFeatured: data.isFeatured,
//               isArchived: data.isArchived,
//               author: data.author,
//               genre: data.genre,
//               store_id: params.storeId,  // Store ID from URL
//             },
//           ]);

//         if (error) throw error;
//       }

//       toast.success(toastMessage);
//       router.push(`/${params.storeId}/books`);
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);

//       const { error } = await supabase
//         .from("books")
//         .delete()
//         .eq("id", params.bookId)
//         .eq("store_id", params.storeId);

//       if (error) throw error;

//       toast.success("Book Removed");
//       router.push(`/${params.storeId}/books`);
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
//           {/* images */}
//           <FormField
//             control={form.control}
//             name="images"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Billboard Image</FormLabel>
//                 <FormControl>
//                   <ImagesUpload
//                     value={field.value.map((image) => image.url)}
//                     onChange={(urls) => {
//                       field.onChange(urls.map((url) => ({ url })));
//                     }}
//                     onRemove={(url) =>
//                       field.onChange(
//                         field.value.filter((current) => current.url !== url)
//                       )
//                     }
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

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
//                       placeholder="Book name..."
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Book Price</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       disabled={isLoading}
//                       placeholder="0"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="author"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Author</FormLabel>
//                   <Select
//                     disabled={isLoading}
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue
//                           defaultValue={field.value}
//                           placeholder="Select an author"
//                         />
//                       </SelectTrigger>
//                     </FormControl>

//                     <SelectContent>
//                       {authors.map((author) => (
//                         <SelectItem key={author.id} value={author.name}>
//                           {author.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="genre"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Genre</FormLabel>
//                   <Select
//                     disabled={isLoading}
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue
//                           defaultValue={field.value}
//                           placeholder="Select a genre"
//                         />
//                       </SelectTrigger>
//                     </FormControl>

//                     <SelectContent>
//                       {genres.map((genre) => (
//                         <SelectItem key={genre.id} value={genre.name}>
//                           {genre.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="isFeatured"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       // @ts-ignore
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>Featured</FormLabel>
//                     <FormDescription>
//                       This book will be on the main page under featured books!
//                     </FormDescription>
//                   </div>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="isArchived"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       // @ts-ignore
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>Archived</FormLabel>
//                     <FormDescription>
//                       This product will not be displayed anywhere inside the
//                       store
//                     </FormDescription>
//                   </div>
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

