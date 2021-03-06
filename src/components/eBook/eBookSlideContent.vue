<template>
  <div class='ebook-slide-contents'>
      <div class='slide-contents-search-wrapper'>
          <div class="slide-contents-search-input-wrapper">
              <div class="slide-contents-search-icon">
                  <span class='icon-search'></span>
              </div>
              <input class='slide-contents-search-input' v-model='searchText' type="text"
               :placeholder="$t('book.searchHint')"
               @keyup.enter.exact='search'
                @click='showSearchPage'>
          </div>
          <div class='slide-contents-search-cancel' v-if='searchVisible' @click='hideSearchPage'>{{$t('book.cancel')}}</div>
      </div>
      <div class='slide-contents-book-wrapper' v-show='!searchVisible'>
          <div class='slide-contents-book-img-wrapper'>
              <img :src="cover" class='slide-contents-book-img'>
          </div>
          <div class="slide-contents-book-info-wrapper" v-if='metadata'>
              <div class="slide-contents-book-title"><span class='slide-contents-book-title-text'>{{metadata.title}}</span></div>
              <div class="slide-contents-book-author"><span class='slide-contents-book-author-text'>{{metadata.creator}}</span></div>
          </div>
          <div class="slide-contents-book-progress-wrapper">
              <div class="slide-contents-book-progress">
                  <span class='progress'>{{progress + '%'}}</span>
                  <span class='progress-text'>{{$t('book.haveRead2')}}</span>
              </div>
              <div class='slide-contents-book-time'>{{getReadTimeText()}}</div>
          </div>
      </div>
      <scroll class='slide-content-list' :top='156' :bottom='48' v-show='!searchVisible' ref='scroll'>
          <div class="slide-content-item" v-for='(item,index) in navigation' :key='index'>{{index}}
              <span class="slide-content-item-label" :style='contentItemStyle(item)' :class='{"selected":section === index}' @click='displayContent(item.href)'>{{item.label}}</span>
              <span class="slide-content-item-page">{{item.page}}</span>
          </div>
      </scroll>
      <scroll class='slide-search-list' :top='66' :bottom='48' v-if='searchVisible'>
          <div class="slide-search-item" v-for='(item,index) in searchList' :key='index' v-html="item.excerpt" @click='displayContent(item.cfi,true)'></div>
      </scroll>
  </div>
</template>

<script>
import {eBookMixin} from '../../utils/mixin'
import {px2rem} from '@/utils/utils'
import Scroll from 'components/common/Scroll'
export default {
    name:'eBookSlideContent',
    components:{
        Scroll
    },
    data(){
        return {
            searchVisible:false,
            searchList:null,
            searchText:''
        }
    },
    mixins:[eBookMixin],
    methods:{
        displayContent(target,hightlight=false){//点击目录标题隐藏所有组件,并跳转到内容页;搜索关键字,点击关键字让其他在内容页高亮显示
            this.display(target,()=>{
                this.hideTitleAndMenu()
                if(hightlight){
                    this.currentBook.rendition.annotations.highlight(target)//让关键字高亮显示
                }
            })
        },
        search(){//搜索关键字并让关键字高亮显示
            if(this.searchText && this.searchText.length > 0){
                this.doSearch(this.searchText).then(list=>{
                    this.searchList = list
                    this.searchList.map(item=>{
                        item.excerpt = item.excerpt.replace(this.searchText,`<span class="content-search-text">${this.searchText}</span>`)
                        return item
                    })
                })
            }
        },
         doSearch(q) {//官方搜索算法
            return Promise.all(
                this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook))
                .then(section.find.bind(section, q))
                .finally(section.unload.bind(section)))
            ).then(results => Promise.resolve([].concat.apply([], results)));
        },
        contentItemStyle(item){
            return {
                marginLeft : `${px2rem(item.level * 15)}rem`//1目录不变,2级目录往后移动15像素
            }
        },
        showSearchPage(){
            this.searchVisible = true
        },
        hideSearchPage(){
            this.searchVisible = false
            this.searchText=''
            this.searchList= null
        }
    },
    mounted(){}
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.ebook-slide-contents{
    width:100%;
    font-size:0;
    .slide-contents-search-wrapper{
        display:flex;
        width:100%;
        height:px2rem(36);
        margin:px2rem(20) 0 px2rem(10) 0;
        padding:0 px2rem(15);
        box-sizing:border-box;
        .slide-contents-search-input-wrapper{
            flex:1;
            @include center;
            .slide-contents-search-icon{
                flex:0 0 px2rem(28);
                font-size:px2rem(12);
                @include center;
            }
            .slide-contents-search-input{
                flex:1;
                width:100%;
                height:px2rem(32);
                font-size: px2rem(14);
                background:transparent;
                border:none;
                &:focus{
                    outline: none;
                }
            }
        }
        .slide-contents-search-cancel{
            flex:0 0 px2rem(50);
            font-size: px2rem(14);
            @include right;
        }
    }
    .slide-contents-book-wrapper{
        display:flex;
        width:100%;
        height:px2rem(90);
        padding:px2rem(10) px2rem(15) px2rem(20) px2rem(15);
        box-sizing:border-box;
        .slide-contents-book-img-wrapper{
            flex:0 0 px2rem(45);
            .slide-contents-book-img{
                width:px2rem(45);
                height:px2rem(60);
            }
        }
        .slide-contents-book-info-wrapper{
            flex:1;
            padding:0 px2rem(10);
            box-sizing: border-box;
            .slide-contents-book-title{
                //width:px2rem(153.75);
                font-size:px2rem(14);
                line-height: px2rem(16);
                @include left;
                .slide-contents-book-title-text{
                    @include ellipsis2(2);
                }
            }
            .slide-contents-book-author{
                //width:px2rem(153.75);//375*0.85(左侧占据面积)= 318.75-30-20-45-70
                font-size:px2rem(12);
                margin-top:px2rem(5);
                line-height: px2rem(16);
                @include left;
                .slide-contents-book-author-text{
                    @include ellipsis2(1);
                }
            }
        }
        .slide-contents-book-progress-wrapper{
            flex:0 0 px2rem(70);
            .slide-contents-book-progress{
                .progress{
                    font-size:px2rem(14);
                }
                .progress-text{
                    font-size:px2rem(12);
                }
            }
            .slide-contents-book-time{
                font-size:px2rem(12);
                margin-top:px2rem(5);
            }
        }
    }
    .slide-content-list{
        padding:0 px2rem(15);
        box-sizing:border-box;
        .slide-content-item{
            display:flex;
            padding:px2rem(20) 0;
            box-sizing:border-box;
            .slide-content-item-label{
                flex:1;
                font-size:px2rem(14);
                line-height: px2rem(16);
                @include ellipsis;
            }
            .selected{
                color:#522;
            }
            .slide-content-item-page{
                flex:0 0 px2rem(30);
                font-size:px2rem(10);
                @include right;
            }
        }
    }
    .slide-search-list{
        width:100%;
        padding:0 px2rem(15);
        box-sizing:border-box;
        .slide-search-item{
            font-size:px2rem(14);
            line-height:px2rem(16);
            padding:px2rem(20) 0;
            box-sizing: border-box;
        }
    }
}
</style>