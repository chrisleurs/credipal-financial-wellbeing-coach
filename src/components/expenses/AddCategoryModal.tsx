
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const MAIN_CATEGORIES = [
  'Food',
  'Transport', 
  'Entertainment',
  'Health',
  'Services',
  'Others'
];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; main_category: string }) => Promise<{ success: boolean }>;
  preselectedCategory?: string;
}

export function AddCategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  preselectedCategory 
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    main_category: preselectedCategory || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        main_category: preselectedCategory || ''
      });
      setErrors({});
    }
  }, [isOpen, preselectedCategory]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Category name must be 50 characters or less';
    }
    
    if (!formData.main_category) {
      newErrors.main_category = 'Please select a main category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        name: formData.name.trim(),
        main_category: formData.main_category
      });

      if (result.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom Category
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Subcategory Name *</Label>
            <Input
              id="category-name"
              type="text"
              placeholder="e.g., Coffee shops"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-destructive' : ''}
              maxLength={50}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          <div>
            <Label htmlFor="main-category">Main Category *</Label>
            <Select 
              value={formData.main_category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, main_category: value }))}
            >
              <SelectTrigger className={errors.main_category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select main category" />
              </SelectTrigger>
              <SelectContent>
                {MAIN_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.main_category && <p className="text-sm text-destructive mt-1">{errors.main_category}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-primary">
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
