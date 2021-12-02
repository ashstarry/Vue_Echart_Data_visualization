const theme = {
  chalk: {
        backgroundColor: '#161522',
        titleColor: '#FFFFFF',
        themeSrc: 'qiehuan_dark.png',
        headerBorderSrc: 'header_border_dark.png',
    sellerAxisPointerColor: '#2D3443',
  },
    vintage: {
    backgroundColor: '#dddddd',
    titleColor: "#000000",
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_light.png',
    sellerAxisPointerColor: '#f1f2f6',
  },
  westeros: {
    backgroundColor: '#dddddd',
    titleColor: "#000000",
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_light.png',
    sellerAxisPointerColor: '#f1f2f6',
  },
}


export function getThemeValue(themeName) {
  return theme[themeName]
}