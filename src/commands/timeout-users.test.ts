import { timeoutUsers } from './timeout-users'

describe('Slash command to timeout users', () => {
  it('Should have the correct name and description', () => {
    expect(timeoutUsers.name).toBe('user-timeout')
    expect(timeoutUsers.description).toBe('Set a user timeout of the guild')
  })

  it('Should have a user option', () => {
    const userOption = timeoutUsers.options?.find(option => option.name === 'user')

    expect(userOption).toBeDefined()
    expect(userOption?.description).toBe('Choose an user to timeout')
    expect(userOption?.required).toBe(true)
  })

  it('Should have a duration option', () => {
    const durationOption = timeoutUsers.options?.find(option => option.name === 'duration')

    expect(durationOption).toBeDefined()
    expect(durationOption).toBeInstanceOf(Object)
    expect(durationOption?.description).toBe('Timeout duration (30 min, 1h, 1 day, and so on)')
    expect(durationOption?.required).toBe(true)
  })

  it('Should have a reason option', () => {
    const reasonOption = timeoutUsers.options?.find(option => option.name === 'reason')

    expect(reasonOption).toBeDefined()
    expect(reasonOption?.description).toBe('The reason for the timeout')
    expect(reasonOption?.required).toBe(true)
  })

  it('Should set default member permissions for MuteMembers', () => {
    const defaultPermission = timeoutUsers.default_member_permissions

    expect(defaultPermission).toBe("4194304")
  })
})