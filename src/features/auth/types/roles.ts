export enum Role {
  PUBLIC = 'PUBLIC',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
  SUDO = 'SUDO',
}

export type SessionUser = {
  id: string
  name: string
  roles: Role[]
  token?: string
}
