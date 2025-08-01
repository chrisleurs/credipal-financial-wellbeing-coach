
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserCategory {
  id: string;
  user_id: string;
  name: string;
  main_category: string;
  created_at: string;
  updated_at: string;
}

export const useUserCategories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's custom categories
  const {
    data: userCategories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-categories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching user categories for user:', user.id);
      const { data, error } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('main_category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching user categories:', error);
        throw error;
      }
      
      console.log('Fetched user categories:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Could not load custom categories",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const addCategory = async (categoryData: {
    name: string;
    main_category: string;
  }) => {
    if (!user) return { success: false };

    try {
      console.log('Adding category:', categoryData);
      const { data, error } = await supabase
        .from('user_categories')
        .insert({
          ...categoryData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['user-categories', user.id] });
      
      console.log('Category added successfully:', data);
      toast({
        title: "Category created",
        description: `Added "${categoryData.name}" to ${categoryData.main_category}`
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: error.message?.includes('unique_user_category') 
          ? "This category already exists" 
          : "Could not create category",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const updateCategory = async (id: string, categoryData: {
    name: string;
    main_category: string;
  }) => {
    try {
      console.log('Updating category:', id, categoryData);
      const { data, error } = await supabase
        .from('user_categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['user-categories', user?.id] });
      
      console.log('Category updated successfully:', data);
      toast({
        title: "Category updated",
        description: "Category updated successfully"
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error.message?.includes('unique_user_category') 
          ? "This category name already exists" 
          : "Could not update category",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('Deleting category:', id);
      const { error } = await supabase
        .from('user_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['user-categories', user?.id] });
      
      console.log('Category deleted successfully');
      toast({
        title: "Category deleted",
        description: "Category deleted successfully"
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Could not delete category",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    userCategories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch
  };
};
