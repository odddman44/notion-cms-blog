import katex from "katex"

interface EquationBlockProps {
  expression: string
  displayMode: boolean
}

/** KaTeX SSR 렌더링 — 서버 컴포넌트에서 수식을 HTML 문자열로 변환 */
export function EquationBlock({ expression, displayMode }: EquationBlockProps) {
  const html = katex.renderToString(expression, {
    throwOnError: false,
    displayMode,
  })

  if (displayMode) {
    return (
      <div
        className="my-4 overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <span
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
