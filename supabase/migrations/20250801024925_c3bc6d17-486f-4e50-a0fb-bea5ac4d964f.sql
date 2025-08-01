
-- Insertar el perfil faltante para el usuario autenticado
INSERT INTO public.profiles (user_id, email, onboarding_completed)
VALUES ('ab80f276-75f1-453a-9c8e-6bc7bfed868a', 'rentas.leurs@gmail.com', false)
ON CONFLICT (user_id) DO NOTHING;
