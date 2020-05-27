module.exports = {
  base: '/vuepress/',
  title: '开发文档',
  description: '前端开发文档',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // sidebar: 'auto',
    nav: [
      {
        text: '项目',
        items: [
          { text: '老板通', link: '/projects/km/boss_online' },
          { text: '科脉数说PC', link: '/projects/km/data_cube' },
          { text: '科脉数说大屏', link: '/projects/km/data_bigCube' },
          { text: '云商历史项目', link: '/projects/km/cloud_shop' }
        ]
      }
    ],
    sidebar:[
      {
        title: '导航',
        collapsable: false,
        children:[
          '/projects/km/boss_online',
          '/projects/km/data_cube',
          '/projects/km/data_bigCube',
          '/projects/km/cloud_shop'
        ]
      }
    ]
  }
}
