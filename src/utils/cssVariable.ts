export function getCssVariable(name: string) {
  const rootEl = document.querySelector(':root')
  if (rootEl !== null) {
    const rootStyle = getComputedStyle(rootEl)
    return rootStyle.getPropertyValue(name)
  }
  return ''
}

export function setCssVariable(name: string, value: string | number) {
  const rootEl = <HTMLElement>document.querySelector(':root')
  if (rootEl !== null) {
    rootEl.style.setProperty(name, <string>value)
  }
}
