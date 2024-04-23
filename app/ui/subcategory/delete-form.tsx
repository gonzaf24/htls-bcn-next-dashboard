'use client';
import { deleteSubcategory } from '@/app/lib/actions';
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
import { useState } from 'react';

export function DeleteSubcategory({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteSubcategoryWithId = deleteSubcategory.bind(null, id);

  const handleDelete = () => {
    setIsOpen(true); // Abrir el cuadro de diálogo de confirmación
  };

  const handleConfirmDelete = () => {
    deleteSubcategoryWithId();
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
            <AlertDialogDescription>
              Are you sure you want to delete this subcategory?
            </AlertDialogDescription>
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
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    </>
  );
}
