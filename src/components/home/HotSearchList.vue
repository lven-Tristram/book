<template>
  <transition name='hot-search-move'>
      <scroll class='hot-search-wrapper' :top='52' @onScroll='onScroll' ref='scroll'>
          <hot-search :label='$t("home.hotSearch")' :btn='$t("home.change")' :hotSearch='searchList.hotSearch'></hot-search>
          <div class='line'></div>
          <hot-search :label='$t("home.historySearch")' :btn='$t("home.clear")' :hotSearch='searchList.historySearch'></hot-search>
      </scroll>
  </transition>
</template>

<script>
import Scroll from 'components/common/Scroll'
import HotSearch from './HotSearch'
import {storeHomeMixin} from '@/utils/mixin'
export default {
    mixins:[storeHomeMixin],
    components:{
        Scroll,
        HotSearch
    },
    data(){
        return {
            searchList:{
                hotSearch:[
                    {
                        type:1,
                        text:'Self-Reported Population Health',
                        num:'2.0万'
                    },
                    {
                        type:1,
                        text:'LibraryAndInformationSciences',
                        num:'3.0万'
                    },
                    {
                        type:1,
                        text:'CorporateDataQuality',
                        num:'2.4万'
                    },
                    {
                        type:1,
                        text:'DeterminantsOfFinancialDevelop',
                        num:'1.0万'
                    },
                    {
                        type:1,
                        text:'ScienceAndTechnologyGovernance',
                        num:'6.0万'
                    },
                    {
                        type:1,
                        text:'ImpactsOfTheFukushimaNuclearAc',
                        num:'8.0万'
                    },
                ],
                historySearch:[
                    {
                        type:2,
                        text:'Computer Science'
                    },
                    {
                        type:2,
                        text:'Computer Science copy1'
                    },
                    {
                        type:2,
                        text:'Computer Science copy2'
                    },
                    {
                        type:2,
                        text:'Computer Science copy3'
                    },
                    {
                        type:2,
                        text:'Computer Science copy4'
                    },
                    {
                        type:2,
                        text:'Computer Science copy5'
                    },
                    {
                        type:2,
                        text:'Computer Science copy6'
                    },
                    {
                        type:2,
                        text:'Computer Science copy7'
                    },
                    {
                        type:2,
                        text:'Computer Science copy8'
                    },
                    {
                        type:2,
                        text:'Computer Science copy9'
                    },
                ]
            }
        }
    },
    methods:{
        onScroll(offsetY){
            this.setHotSearchOffsetY(offsetY)
        },
        reset(){
            this.$refs.scroll.scrollTo(0,0)
        }
    }
}
</script>

<style>

</style>