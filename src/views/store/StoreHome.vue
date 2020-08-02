<template>
    <div class='store-home'>
        <search-bar></search-bar>
        <flap-card :data='random' ref='flapCard' @close='closeFlapCard'></flap-card>
        <scroll :top='scrollTop' @onScroll='onScroll' ref='scroll'>
            <div class="banner-wrapp">
                <div class='banner-img' :style='{backgroundImage:`url("${banner}")`}'></div>
            </div>
            <guess-you-like :data='guessYouLike'></guess-you-like>
            <recommend :data='recommend' class='recommend'></recommend>
            <featured :data='featured' :titleText='$t("home.featured")' :btnText='$t("home.seeAll")'  class='featured'></featured>
            <div class='category-list-wrapper' v-for='(item,index) in categoryList' :key='index'>
                <category-book :data='item'></category-book>
            </div>
            <category class='category' :data='categories'></category>
        </scroll>
    </div>
</template>

<script>
import SearchBar from 'components/home/SearchBar'
import FlapCard from 'components/home/FlapCard'
import GuessYouLike from 'components/home/GuessYouLike'
import Recommend from 'components/home/Recommend'
import Featured from 'components/home/Featured'
import CategoryBook from 'components/home/CategoryBook'
import Category from 'components/home/Category'
import Scroll from 'components/common/Scroll'
import {home,home2} from '@/api/store'
import {storeHomeMixin} from '@/utils/mixin'
import { getLocalStorage, setLocalStorage, getHome, saveHome } from '@/utils/localStorage'
export default {
    name:"StoreHome",
    mixins:[storeHomeMixin],
    data(){
        return {
            scrollTop:94,
            random:null,
            banner:null,
            guessYouLike:null,
            recommend:null,
            featured:null,
            categoryList:null,
            categories:null,
            bookListOffsetY:0,
            isBack:false
        }
    },
    components:{
        SearchBar,
        Scroll,
        FlapCard,
        GuessYouLike,
        Recommend,
        Featured,
        CategoryBook,
        Category
    },
    mounted(){
        home().then(res =>{
            if(res && res.status === 200){
                const data = res.data
                const randomIndex =Math.floor(Math.random()*data.random.length)
                this.random = data.random[randomIndex]
                this.banner = data.banner
                this.guessYouLike = data.guessYouLike
                this.recommend = data.recommend
                this.featured = data.featured
                this.categoryList = data.categoryList
                this.categories = data.categories
            }
        })
    },
    methods:{
        onScroll(offsetY){
            this.setOffsetY(offsetY)
            if(offsetY > 0){
                this.scrollTop = 52
            }else {
                this.scrollTop = 94
            }
            this.$refs.scroll.refresh()
        },
        closeFlapCard(){
            if(!this.flapcardVisible){
                home().then(res=>{
                    const data = res.data
                    const randomIndex =Math.floor(Math.random()*data.random.length)
                    this.random = data.random[randomIndex]
                })
            }
        }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path === '/store/list' && from.query.keyword) {
          vm.ifShowSearchPage = true
          vm.$refs.searchBar.setKeyword(from.query.keyword)
        }
      })
    },
    beforeDestroy() {
      if (this.bookListOffsetY && !this.isBack) {
        setLocalStorage('offsetY', this.bookListOffsetY)
      } else {
        setLocalStorage('offsetY', 0)
      }
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.store-home{
    width:100%;
    height:100%;
    .banner-wrapp{
        width:100%;
        padding:px2rem(10);
        box-sizing: border-box;
        .banner-img{
            width:100%;
            height:px2rem(180);
            background-repeat: no-repeat;
            background-size:100% 100%;
        }
    }
    .recommend{
        margin-top:px2rem(20);
    }
    .featured{
        margin-top:px2rem(20);
    }
    .category-list-wrapper{
        margin-top:px2rem(20);
    }
    .category{
        margin-top:px2rem(20);
    }
}
</style>