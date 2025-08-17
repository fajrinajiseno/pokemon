import '@testing-library/jest-dom'

jest.setTimeout(60000)

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub' // whatever
  }
}))

// jest.mock('next/link', () => ({
//   __esModule: true,
//   default: ({ children, href }) => {
//     return <span href={href}>{children}</span> // whatever
//   },
// }))

// if (global.document) {
//   global.window = {}
//   global.window = global

//   window.scrollTo = (x, y) => {
//     document.documentElement.scrollTop = y
//   }

//   window.HTMLElement.prototype.scrollTo = jest.fn()
// }
