<template>
    <div class='ebook-bookmark' ref='bookmark'>
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref='iconDown'>
                <span class="icon-down"></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" :style='isFixed?fixedStyle:{}'>
            <book-mark :color='color' :width='15' :height='35'></book-mark>
        </div>
    </div>
</template>

<script>
import BookMark from 'components/common/Bookmark'
import { realPx } from '../../utils/utils'
import { eBookMixin } from '../../utils/mixin'
import { getBookmark, saveBookmark } from '../../utils/localStorage'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
    name:"eBookBookMark",
    mixins:[eBookMixin],
    components:{
        BookMark
    },
    data(){
        return {
            text:'',
            color:WHITE,
            isFixed:false
        }
    },
    computed:{
        height(){//吸顶高度
            return realPx(35)
        },
        threshold(){//零界值
            return realPx(55)
        },
        fixedStyle(){
            return {
                position:'fixed',
                top:0,
                right:`${(window.innerWidth-this.$refs.bookmark.clientWidth) / 2}px`
            }
        }
    },
    watch:{
        offsetY(y){
            if(!this.bookAvailable || this.menuVisible || this.settingVisible >=0){
                return
            }
            if(y >= this.height && y < this.threshold){
                this.beforeThreshold(y)
            }else if(y>=this.threshold){
                this.afterThreshold(y)
            }else if(y>0 && y<this.height){
                this.beforeHeight()
            }else if(y === 0){
                this.restore()
            }
        },
        isBookmark(isBookmark){
            this.isFixed = isBookmark
            if(isBookmark){

                this.color=BLUE

            }else {
                this.color = WHITE
            }
        }
    },
    methods:{
        addBookmark(){
            this.bookmark = getBookmark(this.fileName)
            if(!this.bookmark){
                this.bookmark = []
            }
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfibase = currentLocation.start.cfi.replace(/!.*/,'')
            const cfistart = currentLocation.start.cfi.replace(/.*!/,'').replace(/\)$/,'')
            const cfiend = currentLocation.end.cfi.replace(/.*!/,'').replace(/\)$/,'')
            const cfirange = `${cfibase}!,${cfistart},${cfiend})`
            this.currentBook.getRange(cfirange).then(range=>{
                const text = range.toString().replace(/\s\s/g,'')//去掉空格
                this.bookmark.push({
                    cfi:currentLocation.start.cfi,
                    text:text
                })
                saveBookmark(this.fileName,this.bookmark)
            })
        },
        removeBookmark(){
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfi = currentLocation.start.cfi
            this.bookmark = getBookmark(this.fileName)
            if(this.bookmark){
                saveBookmark(this.fileName,this.bookmark.filter(item=>item.cfi !== cfi))
                this.setIsBookmark(false)
            }
        },
        restore(){
            //状态4 归位
            setTimeout(()=>{
                this.$refs.bookmark.style.top = `${-this.height}px`
                this.$refs.iconDown.style.transform = 'rotate(0deg)'
            },200)
            if(this.isFixed){
                //状态3的时候为true
                this.setIsBookmark(true)
                this.addBookmark()
            }else{
                this.setIsBookmark(false)
                this.removeBookmark()
            }
        },
        beforeThreshold(y){
            //状态2未到达零界状态
            this.$refs.bookmark.style.top = `${-y}px`
            this.beforeHeight()
            const iconDown = this.$refs.iconDown
            if(iconDown.style.transform === 'rotate(180deg)'){
                iconDown.style.transform = 'rotate(0deg)'
            }
        },
        afterThreshold(y){
            // 状态3超过零界状态
            this.$refs.bookmark.style.top = `${-y}px`
            if(this.isBookmark){
                this.text = this.$t('book.releaseDeleteMark')
                this.color = WHITE
                this.isFixed = false
            }else{
                this.text = this.$t('book.releaseAddMark')
                this.color = BLUE
                this.isFixed = true
            }
            const iconDown = this.$refs.iconDown
            if(iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)'){
                iconDown.style.transform = 'rotate(180deg)'
            }
        },
        beforeHeight(y){
            //状态1未超过书签的高度
            if(this.isBookmark){
                this.text = this.$t('book.pulldownDeleteMark')
                this.color = BLUE
                 this.isFixed = true
            }else{
                this.text = this.$t('book.pulldownAddMark')
                this.color = WHITE
                 this.isFixed = false
            }

        }
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.ebook-bookmark{
    position:absolute;
    top:px2rem(-35);
    left:0;
    z-index:200;
    width:100%;
    height:px2rem(35);
    .ebook-bookmark-text-wrapper{
        position: absolute;
        right:px2rem(45);
        bottom:0;
        display:flex;
        .ebook-bookmark-down-wrapper{
            font-size:px2rem(14);
            color:white;
            transition:all .2s linear;
            @include center;
        }
        .ebook-bookmark-text{
            font-size:px2rem(14);
            color:#fff;
        }
    }
    .ebook-bookmark-icon-wrapper{
        position:absolute;
        right:0;
        bottom:0;
        margin-right:px2rem(15);
    }
}
</style>