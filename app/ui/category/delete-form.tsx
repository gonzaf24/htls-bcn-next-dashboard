'use client'
import { deleteCategory } from "@/app/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from "react";

export function DeleteCategory({ id }: { id: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const deleteCategoryWithId = deleteCategory.bind(null, id);

    const handleDelete = () => {
      setIsOpen(true); // Abrir el cuadro de diálogo de confirmación
  };
  
  const handleConfirmDelete = () => {
      deleteCategoryWithId();
      setIsOpen(false); // Cerrar el cuadro de diálogo de confirmación
  };

  const handleCancelDelete = () => {
      setIsOpen(false); // Cerrar el cuadro de diálogo de confirmación sin realizar la eliminación
  };
  
  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this category?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <button onClick={handleDelete} className="text-red-600 hover:text-red-900">Delete</button>
    </>
  );
  }