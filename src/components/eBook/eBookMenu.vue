<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-font-popup></ebook-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import { eBookMixin } from '../../utils/mixin'
import EbookSettingFont from './eBookSettingFont'
import EbookFontPopup from './eBookFontPopup'
import EbookSettingTheme from './eBookSettingTheme'
import EbookSettingProgress from './eBookSettingProgress'
import EbookSlide from './eBookSlide'
export default {
    name:"eBookMenu",
    components:{
      EbookSettingFont,
      EbookFontPopup,
      EbookSettingTheme,
      EbookSettingProgress,
      EbookSlide
    },
    mixins:[eBookMixin],
    methods:{
        showSetting(key){
          this.setSettingVisible(key)
        }
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
    .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size:px2rem(20);
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
  .hide-box-shadow {
    box-shadow: none;
  }
</style>