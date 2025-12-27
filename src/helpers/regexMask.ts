export const maskPatterns: Record<string, string> = {
  cpf: '###.###.###-##',
  cnpj: '##.###.###/####-##',
  phone: '(##) #####-####',
  cep: '#####-###',
}

export const maskRegex: Record<string, string> = {
  cpf: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
  cnpj: '\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}',
  phone: '\\(\\d{2}\\) \\d{5}-\\d{4}',
  cep: '\\d{5}-\\d{3}',
}
