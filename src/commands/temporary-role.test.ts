import { temporaryRole } from './temporary-role'

describe('Slash command to time out users from a server', () => {
  it('Should have the correct name and description', () => {
    expect(temporaryRole.name).toBe('temporary-role')
    expect(temporaryRole.description).toBe('Set a temporary role to an user')
  })

  it('Should have an user option', () => {
    const userOption = temporaryRole.options?.find(option => option.name === 'user')
    
    expect(userOption).toBeDefined()
    expect(userOption?.description).toBe('Select an user to assign a temporary role')
    expect(userOption?.required).toBe(true)
  })

  it('Should have a role option', () => {
    const roleOption = temporaryRole.options?.find(option => option.name === 'role')

    expect(roleOption).toBeDefined()
    expect(roleOption?.description).toBe('Choose a role to assign to an user')
    expect(roleOption?.required).toBe(true)
  })

  it('Should have a role-duration option', () => {
    const roleDuration = temporaryRole.options?.find(option => option.name === 'role-duration')

    expect(roleDuration).toBeDefined()
    expect(roleDuration).toBeInstanceOf(Object)
    expect(roleDuration?.description).toBe('Time that this role will be assign to the user (30 min, 1h, 1 day, and so on)')
    expect(roleDuration?.required).toBe(true)
  })

  it('Should set default member permissions for ManageRoles', () => {
    const defaultPermissions = temporaryRole.default_member_permissions

    expect(defaultPermissions).toBe("268435456")
  })
})