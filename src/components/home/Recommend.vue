<template>
  <div class="recommend">
    <title-view :label="$t('home.recommend')" :btn="$t('home.seeAll')" @onClick='reClickList'></title-view>
    <div class="recommend-list">
      <div class="recommend-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" v-lazy="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-medium" ref="title">{{item.title}}</div>
          <div class="num sub-title" ref="num">{{$t('home.readers').replace('$1', item.readers)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TitleView from 'components/home/Title'
  import {categoryText,getCategoryName} from '@/utils/store'
  import { eBookMixin ,storeHomeMixin} from '@/utils/mixin'

  export default {
    mixins: [eBookMixin,storeHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Array
    },
    methods:{
      reClickList(){
        this.$router.push('/store/list')
      },
    }
  }
</script>

<style lang='scss' scoped>
@import 'assets/style/global';

  .recommend {
    .recommend-list {
      width: 100%;
      @include top;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .recommend-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .img-wrapper {
          @include center;
          .img {
            width: 80%;
          }
        }
        .content-wrapper {
          width: 100%;
          margin-top: px2rem(10);
          @include columnCenter;
          .title {
            text-align: center;
            line-height:px2rem(17) !important;
          }
          .num {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
