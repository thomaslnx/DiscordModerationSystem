import { banUsers } from './ban-users'

describe('Slash command to ban users from a server', () => {
  it('Should have the correct name and description', () => {
    expect(banUsers.name).toBe('ban-user')
    expect(banUsers.description).toBe('Ban users that break the rules')
  })

  it('Should have a user option', () => {
    const userOption = banUsers.options?.find(option => option.name === 'user')

    expect(userOption).toBeDefined()
    expect(userOption?.description).toBe('Choose the user that you wanna ban')
    expect(userOption?.required).toBe(true)
  })

  it('Should have a reason option', () => {
    const reasonOption = banUsers.options?.find(option => option.name === 'reason')

    expect(reasonOption).toBeDefined()
    expect(reasonOption?.description).toBe('The reason for the ban')
    expect(reasonOption?.required).toBe(true)
  })

  it('Should set default member permissions for BanMembers', () => {
    const defaultPermissions = banUsers.default_member_permissions
    
    expect(defaultPermissions).toBe('4')
  })
})