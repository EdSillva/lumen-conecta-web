import { z } from 'zod';

import { Role } from '../types/roles';

const roleEnum = z.nativeEnum(Role);

export const createUserSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Nome deve ter pelo menos 2 caracteres')
		.max(100, 'Nome deve ter no máximo 100 caracteres'),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email('E-mail inválido'),
	password: z
		.string()
		.min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter ao menos um número')
        .regex(/[\W_]/, 'Senha deve conter ao menos um caractere especial (ex: !@#$%)')
		.max(128, 'Senha deve ter no máximo 128 caracteres'),
	roles: z
		.array(roleEnum)
		.nonempty('Selecione pelo menos um papel de acesso')
		.max(2, 'Limite de 2 papéis'),
});

export const updateUserSchema = createUserSchema
	.partial()
	.refine((value) => Object.keys(value).length > 0, {
		message: 'Envie ao menos um campo para atualizar'
	});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
