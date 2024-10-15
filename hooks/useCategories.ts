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
        mutationFn: ({ id, token }: { id: number; token: string }) => deleteCategory(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The category has been successfully deleted.',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while deleting the category.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
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
