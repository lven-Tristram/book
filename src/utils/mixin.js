import { mapGetters, mapActions } from 'vuex'
import {themeList,addCss, removeAllCss, getReadTimeByMinute} from '../utils/book'
import {saveLocation, getBookmark} from './localStorage'

export const storeShelfMixin = {
    computed:{
        ...mapGetters([
            //'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible'
        ])
    },
    methods:{
        ...mapActions([
            //'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible'
        ])
    }
}
export const storeHomeMixin = {
    computed:{
        ...mapGetters([
            'offsetY',
            'hotSearchOffsetY',
            'flapcardVisible'
        ])
    },
    methods:{
        ...mapActions([
            'setOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible'
        ]),
        showBookDetail(book){
            this.$router.push({
                path:'/store/detail',
                query:{
                    fileName:book.fileName,
                    category:book.categoryText
                }
            })
        }
    }
}
export const eBookMixin = {
    computed:{
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'currentBook',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark',
            'speakingIconBottom'
        ]),
        themeList(){
            return  themeList(this)
        },
        getSectionName(){
            return this.section ? this.navigation[this.section].label : ''
        }
    },
    methods:{
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setCurrentBook',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark',
            'setSpeakingIconBottom'
        ]),
        initGlobalStyle(){
            removeAllCss()
            switch(this.defaultTheme){
                case 'Default':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
                case 'Eye':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
                    break
                case 'Gold':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
                    break
                case 'Night':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
                    break
                default:
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
            }
        },
        refreshLocation(){//刷新滚动条当前位置
            const currentLocation = this.currentBook.rendition.currentLocation()
            if(currentLocation && currentLocation.start){
                const startCfi = currentLocation.start.cfi
                const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                // console.log(currentLocation.start.index)
                this.setProgress(Math.floor(progress * 100))//进度百分比
                this.setSection(currentLocation.start.index)//刷新页面获取到标题
                saveLocation(this.fileName,startCfi)
                const bookmark = getBookmark(this.fileName)
                if(bookmark){
                    if(bookmark.some(item=>item.cfi === startCfi)){
                        this.setIsBookmark(true)
                    }else{
                        this.setIsBookmark(false)
                    }
                }else {
                    this.setIsBookmark(false)
                }
                if(this.pagelist){
                    const totalPage = this.pagelist.length
                    const currentPage = currentLocation.start.location
                    if(currentPage && currentPage > 0){
                        this.setPaginate(currentPage + ' / ' +  totalPage)
                    }else {
                        this.setPaginate('')
                    }
                }else {
                    this.setPaginate('')
                }
            }
        },
        display(target,cb){
            if(target){
                this.currentBook.rendition.display(target).then(()=>{
                    this.refreshLocation()
                    if(cb) cb() //回调函数
                })
            }else{
                this.currentBook.rendition.display().then(()=>{
                    this.refreshLocation()
                    if(cb) cb()
                })
            }
        },
        hideTitleAndMenu(){//点击隐藏
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        getReadTimeText(){//阅读时间
            return this.$t('book.haveRead').replace('$1',getReadTimeByMinute(this.fileName))//通过国际化来实现
        },
    }
}