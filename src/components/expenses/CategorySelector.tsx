
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';
import { useUserCategories } from '@/hooks/useUserCategories';
import { AddCategoryModal } from './AddCategoryModal';

const MAIN_CATEGORIES = [
  'Food',
  'Transport', 
  'Entertainment',
  'Health',
  'Services',
  'Others'
];

const DEFAULT_SUBCATEGORIES: Record<string, string[]> = {
  Food: ['Restaurants', 'Groceries', 'Delivery', 'Coffee & Snacks'],
  Transport: ['Gas', 'Uber/Taxi', 'Public Transport', 'Parking'],
  Entertainment: ['Streaming Services', 'Movies & Shows', 'Sports & Gym', 'Hobbies'],
  Health: ['Medical', 'Pharmacy', 'Insurance', 'Wellness'],
  Services: ['Phone', 'Internet', 'Utilities', 'Subscriptions'],
  Others: ['Shopping', 'Gifts', 'Personal Care', 'Miscellaneous']
};

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: boolean;
  showAddButton?: boolean;
}

export function CategorySelector({ 
  value, 
  onValueChange, 
  error = false,
  showAddButton = true 
}: CategorySelectorProps) {
  const { userCategories, addCategory } = useUserCategories();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string>('');

  // Organize categories by main category
  const organizedCategories = useMemo(() => {
    const organized: Record<string, string[]> = { ...DEFAULT_SUBCATEGORIES };
    
    // Add user's custom categories
    userCategories.forEach(category => {
      if (!organized[category.main_category]) {
        organized[category.main_category] = [];
      }
      organized[category.main_category].push(category.name);
    });
    
    return organized;
  }, [userCategories]);

  // Check if the current value is a main category or subcategory
  const isMainCategory = MAIN_CATEGORIES.includes(value);
  const currentMainCategory = isMainCategory ? value : 
    Object.keys(organizedCategories).find(main => 
      organizedCategories[main].includes(value)
    ) || '';

  const handleMainCategorySelect = (mainCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setShowSubcategories(true);
    // If there are no subcategories, select the main category directly
    if (!organizedCategories[mainCategory]?.length) {
      onValueChange(mainCategory);
      setShowSubcategories(false);
    }
  };

  const handleSubcategorySelect = (subcategory: string) => {
    onValueChange(subcategory);
    setShowSubcategories(false);
  };

  const handleAddCategory = (mainCategory: string) => {
    setPreselectedCategory(mainCategory);
    setIsAddModalOpen(true);
  };

  const handleAddCategorySubmit = async (data: { name: string; main_category: string }) => {
    const result = await addCategory(data);
    if (result.success) {
      onValueChange(data.name);
      setShowSubcategories(false);
    }
    return result;
  };

  const resetSelection = () => {
    setSelectedMainCategory('');
    setShowSubcategories(false);
    onValueChange('');
  };

  // Find if current value is a custom category
  const isCustomCategory = userCategories.some(cat => cat.name === value);

  return (
    <div className="space-y-2">
      {!showSubcategories ? (
        // Main category selection
        <Select 
          value={isMainCategory ? value : ''} 
          onValueChange={handleMainCategorySelect}
        >
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category">
              {value && (
                <div className="flex items-center gap-2">
                  <span>{isMainCategory ? value : `${currentMainCategory} → ${value}`}</span>
                  {isCustomCategory && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MAIN_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                <div className="flex items-center justify-between w-full">
                  <span>{category}</span>
                  {organizedCategories[category]?.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {organizedCategories[category].length} subcategories
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        // Subcategory selection
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to categories
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedMainCategory} subcategories:
            </span>
          </div>
          
          <Select onValueChange={handleSubcategorySelect}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={`Select ${selectedMainCategory} subcategory`} />
            </SelectTrigger>
            <SelectContent>
              {/* Default subcategories */}
              {DEFAULT_SUBCATEGORIES[selectedMainCategory]?.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
              
              {/* User's custom subcategories */}
              {userCategories
                .filter(cat => cat.main_category === selectedMainCategory)
                .map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">Custom</Badge>
                    </div>
                  </SelectItem>
                ))}
              
              {/* Add new category option */}
              {showAddButton && (
                <SelectItem 
                  value="__add_new__" 
                  onSelect={() => handleAddCategory(selectedMainCategory)}
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Plus className="h-4 w-4" />
                    <span>Add new subcategory...</span>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Current selection display */}
      {value && !showSubcategories && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <Badge variant={isCustomCategory ? "secondary" : "outline"}>
            {isMainCategory ? value : `${currentMainCategory} → ${value}`}
            {isCustomCategory && <span className="ml-1">✨</span>}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSelection}
            className="h-6 px-2 text-xs"
          >
            Change
          </Button>
        </div>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategorySubmit}
        preselectedCategory={preselectedCategory}
      />
    </div>
  );
}
