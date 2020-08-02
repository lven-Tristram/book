<template>
  <div class='ebook' ref='ebook'>
      <!-- <ebook-reader></ebook-reader> -->
      <eBook-reader></eBook-reader>
      <eBook-title></eBook-title>
      <eBook-menu></eBook-menu>
      <eBook-book-mark></eBook-book-mark>
      <eBook-header></eBook-header>
      <eBook-footer></eBook-footer>
  </div>
</template>

<script>
import EBookReader from 'components/eBook/eBookReader'
import EBookTitle from 'components/eBook/eBookTitle'
import EBookMenu from 'components/eBook/eBookMenu'
import EBookBookMark from 'components/eBook/eBookBookMark'
import EBookHeader from 'components/eBook/eBookHeader'
import EBookFooter from 'components/eBook/eBookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import {eBookMixin} from '../../utils/mixin'
export default {
    name:'index',
    components:{
        EBookReader,
        EBookTitle,
        EBookMenu,
        EBookBookMark,
        EBookHeader,
        EBookFooter
    },
    mixins:[eBookMixin],
    watch:{//监听offsetY值变化
        offsetY(y){
            if(!this.menuVisible && this.bookAvailable){//但出现菜单栏的时候,以及分页未完成是不能触发下拉操作
                if(y>0){
                    this.move(y)
                }else if(y === 0){
                    this.restore()
                }
            }
        }
    },
    methods:{
        move(y){
            this.$refs.ebook.style.top = y + 'px'
        },
        restore(){
            this.$refs.ebook.style.top = 0
            this.$refs.ebook.style.transition = 'all .2s linear'
            //每次下拉都会触发.2s动画,显得多次下拉不流畅,所以要清除transition
            setTimeout(()=>{
                this.$refs.ebook.style.transition = ''
            },200)
        },
        startLoopReadTime(){//阅读时间
            let readTime = getReadTime(this.fileName)
            if(!readTime){
                readTime = 0
            }
            this.task = setInterval(()=>{
                readTime++
                if(readTime % 30 === 0){//30的倍数
                    saveReadTime(this.fileName,readTime)
                }
            },1000)
        }
    },
    mounted(){
        this.startLoopReadTime()
    },
    beforeDestroy(){//当当前组件销毁的时候
        if(this.task){//判断task是否存在
            clearInterval(this.task)//如果存在终止 task定时任务
        }
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.ebook{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
}
</style>