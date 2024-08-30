import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange
}) => {
    return (
        <>
            <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        variant="outline"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
                Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
            </p>
        </>
    );
};