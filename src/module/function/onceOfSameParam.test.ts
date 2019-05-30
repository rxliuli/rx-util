import { onceOfSameParam } from './onceOfSameParam'
import { randomInt } from '../number/randomInt'

/**
 * @test {onceOfSameParam}
 */
describe('test onceOfSameParam', () => {
  it('simple example', () => {
    const add = (i: number) => i + Date.now()
    const fn = onceOfSameParam(add)
    const res = fn(0)
    expect(fn(0)).toBe(res)
    expect(fn(0)).toBe(res)
    const res1 = fn(1)
    expect(fn(1)).toBe(res1)
    expect(fn(1)).toBe(res1)
  })
  class User {
    constructor(public name: string, public age?: number) {}
  }
  it('simple example for custom parameter converter', () => {
    // 模拟加倍后用户的年龄
    const doubleAge = (user: { age: number }) => user.age * 2
    const fn = onceOfSameParam(doubleAge, user => user.name)
    expect(fn(new User('rxliuli', 10))).toEqual(20)
    expect(fn(new User('rxliuli', 20))).toEqual(20)
    expect(fn(new User('rxliuli', 30))).toEqual(20)
  })

  it('test simple async function', async () => {
    // 模拟一个根据姓名获取 User 对象的值的 API
    const getById = async (name: any) => new User(name, randomInt(18))
    const fn = onceOfSameParam(getById)
    const res = await fn('rxliuli')
    expect(await fn('rxliuli')).toBe(res)
    // 相同的名字不会真正执行到服务端
    expect(await fn('rxliuli')).toBe(res)
    // 换个名字就不同了
    expect(await fn('ling_meng')).not.toBe(res)
  })
  it('test async function for custom paramater converter', async () => {
    // 模拟加倍用户年龄的异步函数
    const doubleAge = async (user: { age: number }) => user.age * 2
    const fn = onceOfSameParam(doubleAge, user => user.name)
    expect(await fn(new User('rxliuli', 10))).toEqual(20)
    expect(await fn(new User('rxliuli', 20))).toEqual(20)
    expect(await fn(new User('rxliuli'))).toEqual(20)
  })
  it('test this for lambda', async function() {
    // 模拟加倍用户年龄的异步函数
    // @ts-ignore
    this.i = 10
    // 注意: 需要自动绑定 this 的话则函数必须是箭头表达式而非 function
    const doubleAge = async () => {
      // @ts-ignore
      this.i = this.i * 2
      // @ts-ignore
      return this.i
    }
    const fn = onceOfSameParam(doubleAge, user => user.name)
    expect(await fn(new User('rxliuli', 10))).toEqual(20)
    expect(await fn(new User('rxliuli', 20))).toEqual(20)
    expect(await fn(new User('rxliuli'))).toEqual(20)
  })
  it('test this for function', async function() {
    // 模拟加倍用户年龄的异步函数
    // @ts-ignore
    this.i = 10
    // 注意: 需要绑定 this 且函数是 function 的话则必须手动绑定 this
    const doubleAge = async function() {
      // @ts-ignore
      this.i = this.i * 2
      // @ts-ignore
      return this.i
      // @ts-ignore
    }.bind(this)

    const fn = onceOfSameParam(doubleAge, user => user.name)
    expect(await fn(new User('rxliuli', 10))).toEqual(20)
    expect(await fn(new User('rxliuli', 20))).toEqual(20)
    expect(await fn(new User('rxliuli'))).toEqual(20)
  })
  it('test this for bind', async () => {
    // 模拟加倍用户年龄的异步函数
    // 或者绑定到返回的函数上面
    async function doubleAge() {
      // @ts-ignore
      this.i = this.i * 2
      // @ts-ignore
      return this.i
    }
    const fn = onceOfSameParam(doubleAge, user => user.name).bind({ i: 10 })
    expect(await fn(new User('rxliuli', 10))).toEqual(20)
    expect(await fn(new User('rxliuli', 20))).toEqual(20)
    expect(await fn(new User('rxliuli'))).toEqual(20)
  })
})