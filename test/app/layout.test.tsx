import { renderToString } from 'react-dom/server'
import RootLayout from '@/app/layout'

describe('Layout', () => {
  it('renders header, main, and footer', () => {
    const html = renderToString(
      <RootLayout>
        <div>Hello World</div>
      </RootLayout>
    )

    expect(html).toMatchSnapshot()
  })
})
