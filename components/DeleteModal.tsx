// 'use client'

// import React, { useState } from 'react'
// import {
//       AlertDialog,
//       AlertDialogCancel,
//       AlertDialogContent,
//       AlertDialogDescription,
//       AlertDialogFooter,
//       AlertDialogHeader,
//       AlertDialogTitle,
//       AlertDialogTrigger,
//     } from "@/components/ui/alert-dialog"
// import { Button } from './ui/button'
// import { deleteDocument } from '@/lib/actions/room.action'
    
// const DeleteModal = ({roomId}:DeleteModalProps) => {
    
// //      const [open,setOpen]= useState(false)

//     const deleteDocumentHandler= async()=>{
         
//         try {
//              await deleteDocument(roomId)
//         } catch (error) {
//             console.log('Error comes from deleting documents',error)
//         }

//     }



//   return (
//       <AlertDialog>
//       <AlertDialogTrigger className='bg-blue-800 p-2 rounded-md px-3'>Delete</AlertDialogTrigger>
//       <AlertDialogContent className='bg-primary-100'>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription className='text-xl'>
//             This action cannot be undone. This will permanently delete the list
//             and remove your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel className='bg-blue-800 text-white border-none'>Cancel</AlertDialogCancel>
//           <Button
//            variant='destructive'
//            onClick={deleteDocumentHandler}
//            className='gradient-red'
//           >Delete</Button>

//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
    
//   )
// }

// export default DeleteModal
"use client";

import Image from "next/image";
import { useState } from "react";



import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { deleteDocument } from "@/lib/actions/room.action";

export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDocumentHandler = async () => {
    setLoading(true);

    try {
      await deleteDocument(roomId);
      setOpen(false);
    } catch (error) {
      console.log("Error notif:", error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-9 rounded-xl bg-transparent p-2 transition-all">
          <Image
            src="/assets/icons/delete.svg"
            alt="delete"
            width={20}
            height={20}
            className="mt-1"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <Image
            src="/assets/icons/delete-modal.svg"
            alt="delete"
            width={48}
            height={48}
            className="mb-4"
          />
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <DialogClose asChild className="w-full bg-dark-400 text-white">
            Cancel
          </DialogClose>

          <Button
            variant="destructive"
            onClick={deleteDocumentHandler}
            className="gradient-red w-full"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};