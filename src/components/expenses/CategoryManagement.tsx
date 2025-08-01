
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useUserCategories } from '@/hooks/useUserCategories';
import { AddCategoryModal } from './AddCategoryModal';

export function CategoryManagement() {
  const { userCategories, addCategory, deleteCategory } = useUserCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Group categories by main category
  const categoriesByMain = userCategories.reduce((acc, category) => {
    if (!acc[category.main_category]) {
      acc[category.main_category] = [];
    }
    acc[category.main_category].push(category);
    return acc;
  }, {} as Record<string, typeof userCategories>);

  const handleAddCategory = async (data: { name: string; main_category: string }) => {
    return await addCategory(data);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this custom category?')) {
      await deleteCategory(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Custom Categories
          </CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userCategories.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No custom categories yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create personalized categories to better organize your expenses
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categoriesByMain).map(([mainCategory, categories]) => (
              <div key={mainCategory}>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  {mainCategory}
                  <Badge variant="outline" className="text-xs">
                    {categories.length} custom
                  </Badge>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">Custom</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCategory}
        />
      </CardContent>
    </Card>
  );
}
