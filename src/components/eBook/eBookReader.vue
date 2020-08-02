<template>
  <div class='ebook'>
      <div class='ebook-reader'>
          <div id='read'></div>
          <div class='ebook-reader-mask'
          @click='onMaskClick'
          @touchmove='move' @touchend='moveEnd'
          @mousedown.left="onMouseEnter"
          @mousemove.left="onMouseMove"
          @mouseup.left="onMouseEnd"><!--书签模板-->
          </div>
      </div>
  </div>
</template>

<script>
import { eBookMixin } from '../../utils/mixin'
import {getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme,getLocation} from '../../utils/localStorage'
import Epub from 'epubjs'
import { flatten } from '../../utils/book'
// global.ePub = Epub
export default {
    name:"eBookReader",
    mixins:[eBookMixin],
    methods:{
        onMouseEnter(e){
            this.mouseState = 1
            this.mouseStateTime = e.timeStamp
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseMove(e){
            if(this.mouseState === 1){
                this.mouseState = 2
            }else if(this.mouseState === 2){
                let offsetY = 0
                if(this.firstOffsetY){
                    offsetY = e.clientY - this.firstOffsetY
                    this.setOffsetY(offsetY)
                }else{
                    this.firstOffsetY = e.clientY
                }
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseEnd(e){
            if(this.mouseState === 2){
                this.setOffsetY(0)
                this.firstOffsetY = 0
                this.mouseState = 3
            }else {
                this.mouseState = 4
            }
            const time = e.timeStamp - this.mouseStateTime
            if(time < 100){
                this.mouseState = 4
            }
            e.preventDefault()
            e.stopPropagation()
        },
        move(e){
            let offsetY = 0
            if(this.firstOffsetY){
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            }else{
                this.firstOffsetY = e.changedTouches[0].clientY
            }
            e.preventDefault()
            e.stopPropagation()
        },
        moveEnd(e){//还原偏移的值
            this.setOffsetY(0)
            this.firstOffsetY = 0
        },
        onMaskClick(e){
            if(this.mouseState && (this.mouseState === 2 || this.mouseState === 3)){
                return
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if(offsetX>0 && offsetX < width*0.3){
                this.prevPage()
            }else if(offsetX>0 && offsetX > width * 0.7){
                this.nextPage()
            }else{
                this.toggleTitleAndMenu()
            }

        },
        prevPage(){//上一页
            if(this.rendition){
                this.rendition.prev().then(()=>{
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        nextPage(){//下一页
            if(this.rendition){
                this.rendition.next().then(()=>{
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        toggleTitleAndMenu(){
            if(this.menuVisible){
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
            this.setMenuVisible(!this.menuVisible)
        },
        initTheme(){
            let defaultTheme = getTheme(this.fileName)
            if(!defaultTheme){
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName,defaultTheme)
            }
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name,theme.style)
            })
            this.setDefaultTheme(defaultTheme)
            this.rendition.themes.select(defaultTheme)
        },
        initFontSize(){
            let fontSize = getFontSize(this.fileName)//初始化字号
                if(!fontSize){
                    saveFontSize(this.fileName,this.defaultFontSize)
                }else{
                    this.rendition.themes.fontSize(fontSize)
                    this.setDefaultFontSize(fontSize)
                }
        },
        initFontFamily(){
            let font = getFontFamily(this.fileName)//初始化字体
                if(!font){
                    saveFontFamily(this.fileName,this.defaultFontFamily)
                }else{
                    this.rendition.themes.font(font)
                    this.setDefaultFontFamily(font)
                }
        },
        initRendition(){//渲染初始化过程
            this.rendition = this.book.renderTo('read',{
                width:innerWidth,
                height:innerHeight,
                method:'default',//兼容微信
                //flow:'scrolled'滚动模式,不支持安卓和ios
            })
            const location = getLocation(this.fileName)
            this.display(location,()=>{
                this.initTheme()
                this.initFontSize()
                this.initFontFamily()
                this.initGlobalStyle()
            })
            // this.rendition.display().then(()=>{
            //     this.initTheme()
            //     this.initFontSize()
            //     this.initFontFamily()
            //     this.initGlobalStyle()
            //     this.refreshLocation()
            // })
            this.rendition.hooks.content.register(contents => {
                Promise.all([//cabin,montserrat,tangerine
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),//可以手动添加样式文件
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                ]).then(()=>{})
            })
        },
        initGesture(){//手势操作
             this.rendition.on('touchstart', event => {//__proto__.touchstart
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            })
            this.rendition.on('touchend', event => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if(time < 500 && offsetX > 40){
                    this.prevPage()
                }else if(time < 500 && offsetX < -40){
                    this.nextPage()
                }else {
                    this.toggleTitleAndMenu()
                }
                event.preventDefault()
                event.stopPropagation()
            })
        },
        parseBook(){//获取书籍封面以及标题,作者信息
            this.book.loaded.cover.then(cover=>{//获取封面图片
                this.book.archive.createUrl(cover).then(url=>{//将封面图片保存在storage中
                    this.setCover(url)
                })
            })
            this.book.loaded.metadata.then(metadata=>{
                // console.log(metadata)
                this.setMetadata(metadata)
            })
            this.book.loaded.navigation.then(nav=>{
                const navItem = flatten(nav.toc)
                function find(item,level=0){
                    return !item.parent? level : find(navItem.filter(parentItem=>parentItem.id === item.parent)[0],++level)
                }
                navItem.forEach(item=>{
                    item.level = find(item)
                })
                this.setNavigation(navItem)
            })
        },
        initEpub(){
            const url = process.env.VUE_APP_RES_URL+'/epub/'+this.fileName+'.epub'//process.env.VUE_APP_RES_URL+'/epub/'+this.fileName+'.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.initRendition()
            this.initGesture()
            this.parseBook()
            this.book.ready.then(()=>{//分页
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName)/16))
            }).then(localtions=>{
                this.navigation.forEach(nav=>nav.pagelist = [])
                localtions.forEach(item=>{
                    const loc = item.match(/\[(.*)\]!/)[1]
                    this.navigation.forEach(nav=>{
                        if(nav.href){
                            const href = nav.href.match(/^(.*)\.html$/)[1]
                            if(href === loc){
                                nav.pagelist.push(item)
                            }
                        }
                    })
                    let currentPage = 1
                    this.navigation.forEach((nav,index)=>{
                        if(index === 0){
                            nav.page = 1
                        }else {
                            nav.page = currentPage
                        }
                        currentPage += nav.pagelist.length + 1
                    })
                })
                this.setPagelist(localtions)
                this.setBookAvailable(true)
                this.refreshLocation()
            })
        },
    },
    mounted(){
        const fileName = this.$route.params.fileName.split('|').join('/');///History%7C2017_Book_InterdisciplinaryPerspectivesO
        this.setFileName(fileName).then(()=>{
            this.initEpub()
        })

    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.ebook-reader{
    width:100%;
    height:100%;
    overflow: hidden;
    .ebook-reader-mask{
        position:absolute;
        z-index:100;
        top:0;
        left:0;
        background: transparent;
        width:100%;
        height:100%;

    }
}
</style>