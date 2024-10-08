import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, deleteCategory } from '@/utils/category';
import Swal from "sweetalert2";

export const useCategories = () => {
    const queryClient = useQueryClient();

    const { data: categories, isPending, error, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The category has been successfully deleted.',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while deleting the category.',
                confirmButtonColor: '#3085d6',
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                showConfirmButton: false
            });
        },
    });

    return {
        categories,
        isPending,
        error,
        isLoading,
        deleteCategoryMutation,
    };
};