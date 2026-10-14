import { useState } from "react";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/features/category/categoryAPI";
import type { Category } from "@/features/category/categoryType";
import CategoryForm from "./_components/category-form";

const CategoriesSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between rounded-lg border px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

const Categories = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = data?.data ?? [];

  const handleDelete = (category: Category) => {
    if (deletingId) return;
    if (!confirm(`Delete "${category.name}"? Existing transactions will move to "Uncategorized".`)) return;

    setDeletingId(category._id);
    deleteCategory(category._id)
      .unwrap()
      .then(() => toast.success("Category deleted"))
      .catch((err) => toast.error(err?.data?.message || "Failed to delete category"))
      .finally(() => setDeletingId(null));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDone = () => {
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Categories</h3>
        <p className="text-sm text-muted-foreground">
          Manage your transaction categories. To add a new category, use the transaction form.
        </p>
      </div>

      {editingCategory && (
        <CategoryForm category={editingCategory} onDone={handleDone} />
      )}

      {isLoading ? (
        <CategoriesSkeleton />
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const isRowDeleting = deletingId === cat._id;
            return (
              <div
                key={cat._id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                  {cat.isDefault && (
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEdit(cat)}
                    disabled={isRowDeleting}
                    aria-label={`Edit ${cat.name}`}
                    title={`Edit ${cat.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cat)}
                    disabled={isRowDeleting}
                    aria-label={`Delete ${cat.name}`}
                    title={`Delete ${cat.name}`}
                  >
                    {isRowDeleting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
