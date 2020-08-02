<template>
    <transition name='fade'>
    <div class='slide-content-wrapper' v-show='menuVisible && settingVisible === 3'>
        <transition class='slide-right'>
        <div class='content' v-show='settingVisible === 3'>
            <div class='content-wrapper' v-if='bookAvailable'>
                <div class='content-page'>
                    <component :is='currentTab === 1 ? content : bookmark'></component>
                </div>
                <div class='content-page-tab'>
                    <div class='content-page-tab-item' :class='{"selected":currentTab === 1}' @click='selectTab(1)'>{{$t('book.navigation')}}</div>
                    <div class='content-page-tab-item' :class='{"selected":currentTab === 2}' @click='selectTab(2)'>{{$t('book.bookmark')}}</div>
                </div>
            </div>
            <div class="content-empty" v-else>
                <ebook-loading></ebook-loading>
            </div>
        </div>
        </transition>
        <div class='content-bg' v-if="settingVisible === 3 || settingVisible === 4" @click='hideTitleAndMenu()'></div>
    </div>
    </transition>
</template>

<script>
import EbookSlideContent from './eBookSlideContent'
import EbookLoading from './eBookLoading'
import EbookBookmark from './eBookSlideBookmark'
import {eBookMixin} from '../../utils/mixin'

export default {
    name:'eBookSlide',
    components:{
        EbookSlideContent,
        EbookLoading,
        EbookBookmark
    },
    data(){
        return {
            currentTab:1,
            content:EbookSlideContent,
            bookmark:EbookBookmark
        }
    },
    mixins:[eBookMixin],
    methods:{
        selectTab(tab){
            this.currentTab = tab
        }
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.slide-content-wrapper{
    display:flex;
    position:absolute;
    top:0;
    left:0;
    z-index:150;
    width:100%;
    height:100%;
    .content{
        flex:0 0 85%;
        width:85%;
        height:100%;
        .content-wrapper{
            display:flex;
            flex-direction: column;
            width:100%;
            height:100%;
            overflow: hidden;
            .content-page{
                flex:1;
                width:100%;
                overflow: hidden;
            }
            .content-page-tab{
                display:flex;
                flex:0 0 px2rem(48);
                width: 100%;
                height:px2rem(48);
                .content-page-tab-item{
                    flex:1;
                    font-size:px2rem(12);
                    @include center;
                }
            }
        }
        .content-empty{
            width:100%;
            height:100%;
            @include center;
        }
    }
    .content-bg{
        flex:0 0 15%;
        width:15%;
        height:100%;
    }
}
</style>