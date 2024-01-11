import { unbanUsers } from './unban-users'

describe('Slash command to unban users', () => {
  it('Should have the correct name and description', () => {
    expect(unbanUsers.name).toBe('unban-user')
    expect(unbanUsers.description).toBe('Unban back to the channel a banned user')
  })

  it('Should have an user option', () => {
    const userOption = unbanUsers.options?.find(option => option.name === 'user')

    expect(userOption).toBeDefined()
    expect(userOption?.description).toBe('Choose one user to unban')
    expect(userOption?.required).toBe(true)
  })

  it('Should have a reason option', () => {
    const reasonOption = unbanUsers.options?.find(option => option.name === 'reason')

    expect(reasonOption).toBeDefined()
    expect(reasonOption?.description).toBe('Reason for unban user')
    expect(reasonOption?.required).toBe(true)
  })
})