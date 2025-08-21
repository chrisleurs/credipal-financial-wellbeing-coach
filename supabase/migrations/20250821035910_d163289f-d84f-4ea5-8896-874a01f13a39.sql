
-- Eliminar el usuario del sistema de autenticación de Supabase
-- Esto también eliminará automáticamente los registros relacionados debido a las políticas ON DELETE CASCADE
DELETE FROM auth.users WHERE email = 'chrisleurs9206@gmail.com';

-- Verificar que no queden registros relacionados en las tablas públicas
DELETE FROM public.profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'chrisleurs9206@gmail.com'
);

DELETE FROM public.user_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'chrisleurs9206@gmail.com'
);

-- Verificar que la eliminación fue exitosa
SELECT 
  'auth.users' as tabla, 
  count(*) as registros_restantes 
FROM auth.users 
WHERE email = 'chrisleurs9206@gmail.com'
UNION ALL
SELECT 
  'public.profiles' as tabla, 
  count(*) as registros_restantes 
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'chrisleurs9206@gmail.com';
