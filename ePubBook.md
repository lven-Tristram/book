问题:
1将电子书放到public目录下但是无法渲染.电子书路径为'/public/2012_Book_Subject-OrientedBusinessProces.epub'
解决:
改变电子书路径'/2012_Book_Subject-OrientedBusinessProces.epub'

2.ePubjs因为3.8版本以上,对有手势操作touch事件无效
解决:
将ePubjs下调;在package.json中,将"epubjs": "^0.3.85";改为"epubjs": "0.3.71" 执行npm install.

npm install --save web-storage-cache
用于封装存储功能,存储时是json,获取时是对象

在选中字体时,页面刷新,选中的字体没有变化,而且选择字体标签与选中字体相对应
首先应该把选中的字体对象保存在LocalStorage中;
然后,在页面刷新的时候调用rendition.themes.font(字体对象)传入字体对象,这样能保证在页面刷新时,依然是当初选择的字体
最后,调用业务功能setDefaultFontFamily(字体对象)传入字体对象font,这样在页面刷新时候,选择栏标题是当初选择字体的名称

技术栈
Vue,js:vue全家桶,vue-cli3,vue调试工具,vue-i18n国际化
HTML5:range控件(滑块),audio控件(听书播放器),LocalStorage(数据缓存),IndexedDB(电子书离线缓存)
css:字体图标Web字体,keyframes动画,scss,rem
js:es6(业务逻辑),mock.js(接口的模拟请求),touchMouse事件,axios(http请求)
阅读器:epubjs(阅读器引擎),科大讯飞api(在线合成语音),Reader,book.js(电子书操作库)
发布:Git,阿里云,Nginx(管理静态资源),Node.js

阅读器工作原理
阅读器引擎将电子书(txt,pdf,epub,mobi)解析(书名,作者,目录,封面,章节)并渲染到界面上,还提供一些辅助功能(字号,字体,场景,书签,搜索)
ePub阅读器
需求分析
阅读器-->解析+渲染-->字号+字体--->主题--->进度--->目录--->搜索--->书签--->页眉+页脚--->分页

主要技术点:
ePubjs--->深度应用
vuex+mixin--->实现记录与复用
vue-i18n--->实现国际化
动态切换主题+书签手势操

所有组件样式共享结构
<style lang='scss' scoped>
@import 'assets/style/global';

localForage:http://localforage.docschina.org/--->离线存储
电子书目录功能:
组件名称:eBookSlide:侧边栏
样式:使用<transition>叠加,最外层使用class='fade'包裹 content部分被包裹在class='slide-right',这样看上去比较流畅
难点:
1.如何将树形结构转化为1维竖型结构?
2.利用[].concat()合并数组
参考:实现个性化需求时候,可以借助回调函数来完成
bug:
在快速点击下一章节时候,会报一个错误'cfi不存在',这个错误在mixin.js--->currentLocation.start.cfi
解决:判断currentLocation && currentLocation.start存在时候,再执行
标题章节目录标题不一致,问题在eBookSettingProgress.vue组件,计算属性里;原先判断的是sectionInfo && sectionInfo.href &&this.currentBook && this.currentBook.navigation
解决:将整个if(this.section){...}注释掉,改为return this.section ? this.navigation[this.section].label : ''
新知识:数组降维[].concat.apply([], array)),通过apply,传入1个空的数组,能将array多维数组降级为1维数组
坑:
问题:vue.runtime.esm.js?2b0e:619 [Vue warn]: Error in render: "TypeError: Cannot read property 'title' of null"
在组件标签里通过{{metadata.title}}渲染数据报错,原因,因为数据是存储在vuex中,默认的值一般为null或者'',所以直接调用时候会报错
解决:
在该吧标签中,添加v-if='metadata'来判断metadata是否存在,如果存在渲染数据,否则相反

书籍书签功能更
loading功能:
eBookLoading.vue
难点:手势操作,往下拉顶部出现添加书签提示,添加成功后让书签图标改变,并且图标出现在当前章节的右上角;再次下拉会出现删除书签提示,删除成功后让图标改变,并让当前章节图标消失.
1.首先,监听touchmove事件

PC端鼠标状态分4个阶段
1.鼠标进入
2.鼠标进入后移动
3.鼠标从移动状态松手
4.鼠标还原
屏幕闪烁问题:
给body标签样式属性添加-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
在微信方面遇到下拉问题
在eBookReader.vue中methods属性下,move(e)函数中添加e.preventDefault();以及在书籍渲染中添加method:'default',//兼容微信

复杂交互的实现思路
分析:捕捉细节,看懂需求
拆分:将复杂问题转化为若干简单问题的集合
求解:针对简单问题进行求解(需要开脑洞)
优化:对实现过程进行优化

标题和搜索框
向下滑动屏幕时的交互细节分析
1.标题和推荐图标向下渐隐
2.搜索框向上移动到标题位置
3.搜索框逐渐变窄以适应屏幕(难点)
4.返回按钮向下居中
5.标题下方显示阴影

mock.js介绍
源码:https://github.com/nuysoft/Mock
替换原生的XMLHttpRequest,使用简便
丰富的数据类型
无法支持blob类型,无法模拟下载
mack文件下的js文件
bookHome:书城首页数据
bookShelf:书架数据
booklist:所有图书列表
flatList:用于查询

@click.stop:阻止事件冒泡

项目进度
1.已完成字号,字体,主题,进度设置功能

VUE_APP_EPUB_URL=http://47.99.166.157/epub
VUE_APP_EPUB_OPF_URL=http://47.99.166.157/epub2
VUE_APP_RES_URL=http://47.99.166.157/book/res
VUE_APP_BASE_URL=http://47.99.166.157:3000
VUE_APP_VOICE_URL=http://47.99.166.157:3000
VUE_APP_BOOK_URL=http://47.99.166.157:3000