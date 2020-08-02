<template>
    <div class='store-shelf'>
        <shelf-title class="shelf-title"
                     :title="$t('shelf.title')"
                     :isEditMode.sync="isEditMode"
                     :data="bookList"
                     :ifShowBack="ifShowBack"
                     :ifShowClear="ifShowClear"
                     @onEditClick="onEditClick"
                     @clearCache="clearCache"
                     ref="shelfTitle"
                     v-show="ifShowTitle"></shelf-title>
        <scroll class="book-shelf-scroll-wrapper" :top="0" :bottom="scrollBottom" :initPosition="initPosition" @onScroll="onScroll" ref="scroll">
            <shelf-search  @onSearchClick="onSearchClick" @onCancel="onSearchCancel" @onTabClick="onSearchTabClick"  ref="shelfSearch" v-if="!isDataEmpty"></shelf-search>
            <shelf class="book-shelf-list" :data="bookList" :showType="showType" :isEditMode="isEditMode" @onBookClick="onBookClick" ref="bookShelf" v-if="!isDataEmpty"></shelf>
            <shelf-empty  class="book-shelf-empty" v-if="isDataEmpty"></shelf-empty>
        </scroll>
        <shelf-footer class="book-shelf-footer"
                    :data="bookList" :bookList="bookList" :isInGroup="false"
                    @setPrivate="setPrivate"
                    @setDownload="setDownload"
                    @removeBook="removeBook"
                    @groupEdit="groupEdit"
        v-show="isEditMode"></shelf-footer>
        <toast :text="toastText" ref="toast"></toast>
    </div>
</template>

<script>
import ShelfTitle from 'components/shelf/ShelfTitle'
import ShelfSearch from 'components/shelf/ShelfSearch'
import ShelfFooter from 'components/shelf/ShelfFooter'
import Shelf from 'components/shelf/Shelf'
import Toast from 'components/shelf/Toast'
import ShelfEmpty from 'components/shelf/ShelfEmpty'
import Scroll from 'components/common/Scroll'
import {storeShelfMixin} from '@/utils/mixin'
import {shelf,download} from '@/api/store'
import {getLocalStorage,setLocalStorage,clearLocalStorage} from '@/utils/localStorage'
import {getLocalForage,clearLocalForage} from '@/utils/localForage'
import { removeBookCache } from '@/utils/book'
import { realPx } from '@/utils/utils'
import Epub from 'epubjs'

const BOOK_SHELF_KEY = 'bookShelf'
export default {
    name:"StoreShelf",
    // mixins:[storeShelfMixin],
    components:{
        ShelfTitle,
        ShelfSearch,
        ShelfFooter,
        Shelf,
        ShelfEmpty,
        Toast,
        Scroll
    },
    data(){
        return{
            bookList: [],
            ifShowTitle: true,
            isEditMode: false,
            ifShowBack: false,
            ifShowClear: true,
            scrollBottom: 0,
            toastText: '',
            showType: 0,
            initPosition: {x: 0,y: 0}
        }
    },
    computed:{
        isDataEmpty() {
            // console.log(this.bookList)
            return !this.bookList || this.bookList.filter(item => item.type !== 3).length === 0
        }
    },
    methods:{
        hideToast() {
          this.$refs.toast.hide()
        },
        //标题
        clearCache() {
            clearLocalStorage()
            clearLocalForage(() => {
            console.log('清除localForage成功...')
            this.getBookShelf()
            })
            this.showToast(this.$t('shelf.clearCacheSuccess'))
        },
        getBookShelf() {
            this.bookList = this.getBookShelfFromLocalStorage()
            if (!this.bookList) {
            shelf().then(response => {
                this.bookList = response.data.bookList
                if (!this.bookList) {
                this.bookList = []
                }
                this.appendAddToBookList()
                this.saveBookShelfToLocalStorage()
                this.initBookShelf()
            })
            }
            this.initBookShelf()
        },
        showToast(text) {
            this.toastText = text
            this.$refs.toast.show()
        },
        //标题
      onBookClick(item, index) {
            this.$router.push({
            path: '/store/detail',
            query: {
                fileName: item.fileName,
                category: item.categoryText
            }
            })
      },
      onEditClick(v) {
        this.isEditMode = v
        if (!this.isEditMode) {
          this.bookList.forEach(item => {
            if (item.bookId) {
              item.selected = false
            } else if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        if (this.isEditMode) {
          this.scrollBottom = 48
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        } else {
          this.scrollBottom = 0
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        }
      },
      getBookShelf() {
        this.bookList = this.getBookShelfFromLocalStorage()
        if (!this.bookList) {
          shelf().then(response => {
            this.bookList = response.data.bookList
            if (!this.bookList) {
              this.bookList = []
            }
            this.appendAddToBookList()
            this.saveBookShelfToLocalStorage()
            this.initBookShelf()
          })
        }
        this.initBookShelf()
      },
      appendAddToBookList() {
        this.bookList.push({
          cover: '',
          title: '',
          type: 3,
        //   id: this.bookList[this.bookList.length - 1].id + 1
          id: Number.MAX_SAFE_INTEGER
        })
      },
      saveBookShelfToLocalStorage() {
        setLocalStorage(BOOK_SHELF_KEY, this.bookList)
      },
      initBookShelf() {
        if (this.bookList) {
          this.bookList.forEach(item => {
            item.selected = false
          })
        }
      },
      getBookShelfFromLocalStorage() {
        return getLocalStorage(BOOK_SHELF_KEY)
      },
      onScroll(offsetY) {
        if (offsetY > realPx(54)) {
          this.$refs.shelfTitle.showShadow()
          if (!this.ifShowTitle) {
            this.$refs.shelfSearch.showShadow()
          }
        } else {
          this.$refs.shelfTitle.hideShadow()
          if (this.$refs.shelfSearch) {
            this.$refs.shelfSearch.hideShadow()
          }
        }
      },
      //搜索栏
      onSearchClick() {
        this.onEditClick(false)
        this.showType = 1
        this.hideTitle()
      },
      onSearchCancel() {
        this.showTitle()
        this.showType = 0
        this.$refs.scroll.scrollTo(0, 0)
      },
      onSearchTabClick(id) {
        this.showType = id
      },
       //搜索栏
       showTitle() {
        this.ifShowTitle = true
      },
      hideTitle() {
        this.ifShowTitle = false
      },
      setPrivate(v) {
        this.bookList.forEach(item => {
          if (item.selected) {
            item.private = v
          }
        })
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        if (v) {
          this.showToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.showToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      async setDownload(needDownload) {
        this.showContinueToast(this.$t('shelf.startDownload'))
        for (let i = 0; i < this.bookList.length; i++) {
          const item = this.bookList[i]
          if (needDownload && item.selected) {
            await this.downloadBook(item).then(() => {
              item.cache = needDownload
            })
          } else if (!needDownload && item.selected) {
            await this.removeDownloadBook(item).then(() => {
              item.cache = needDownload
            })
          }
          if (item.itemList) {
            for (let i = 0; i < item.itemList.length; i++) {
              await this.downloadItem(item.itemList[i], needDownload)
            }
          }
        }
        this.hideToast()
        if (needDownload) {
          this.showToast(this.$t('shelf.setDownloadSuccess'))
        } else {
          this.showToast(this.$t('shelf.removeDownloadSuccess'))
        }
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        console.log('数据保存成功...')
      },
      showContinueToast(text) {
        this.toastText = text
        this.$refs.toast.continueShow()
      },
      async downloadItem(subItem, needDownload) {
        if (needDownload && subItem.selected) {
          await this.downloadBook(subItem).then(() => {
            subItem.cache = needDownload
          })
        } else if (!needDownload && subItem.selected) {
          await this.removeDownloadBook(subItem).then(() => {
            subItem.cache = needDownload
          })
        }
      },
      removeDownloadBook(item) {
        return removeBookCache(item.fileName)
      },
      downloadBook(item) {
        return new Promise((resolve, reject) => {
          getLocalForage(item.fileName, (err, value) => {
            if (!err && value instanceof Blob) {
              console.log(`[${item.fileName}]读取成功...`, value, new Epub(value))
              resolve()
            } else {
              download(item, item => {
                console.log('[' + item.fileName + ']下载成功...')
                resolve()
              }, reject, reject, progressEvent => {
                const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
                this.toastText = this.$t('shelf.progressDownload').replace('$1', `${item.fileName}.epub(${progress})`)
              })
            }
          })
        })
      },
      removeBook() {
        this.bookList = this.bookList.filter(item => {
          if (item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected
            })
          }
          return !item.selected
        })
        // this.$refs.bookShelf.showRemoveAnimation()
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
      },
      groupEdit(operation, group) {
        switch (operation) {
          case 1:
            this.moveToGroup(group)
            break
          case 2:
            this.newGroup(group)
            this.moveToGroup(group)
            break
          case 3:
            this.moveOutGroup()
            break
        }
      },
      moveToGroup(group) {
        const selectedBooks = this.getSelectedBooks()
        this.clearSelectedBooks()
        if (group && group.itemList) {
          group.itemList = [...group.itemList, ...selectedBooks]
          group.itemList.forEach((item, index) => {
            item.id = index + 1
          })
        }
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        this.showToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
      },
      newGroup(group) {
        this.clearAddFromBookList()
        this.bookList.push(group)
        this.appendAddToBookList()
      },
      moveOutGroup() {
        this.clearAddFromBookList()//
        const selectedBooks = this.getSelectedBooks()//
        this.clearSelectedBooks()//
        this.appendBookToList(selectedBooks)//
        this.appendAddToBookList()//
        this.onEditClick(false)//
        this.saveBookShelfToLocalStorage()//
        this.showToast(this.$t('shelf.moveBookOutSuccess'))
      },
      clearAddFromBookList() {
        this.bookList = this.bookList.filter(item => {
          return item.type !== 3
        })
      },
      getSelectedBooks() {
        const selectedBooks = this.bookList.filter(item => {
          return item.selected
        })
        this.bookList.filter(item => {
          if (item.type === 2 && item.itemList) {
            item.itemList.filter(subItem => {
              if (subItem.selected) {
                selectedBooks.push(subItem)
              }
            })
          }
        })
        return selectedBooks
      },
      clearSelectedBooks() {
        this.bookList = this.bookList.filter(item => {
          return !item.selected
        })
        this.bookList.forEach(item => {
          if (item.type === 2 && item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected
            })
          }
        })
      },
      appendBookToList(selectedBooks) {
        let id = this.bookList[this.bookList.length - 1].id + 1
        selectedBooks.forEach(item => {
          item.id = id++
          this.bookList.push(item)
        })
      },
      saveBookShelfToLocalStorage() {
        setLocalStorage(BOOK_SHELF_KEY, this.bookList)
      },
    },
    mounted() {
      this.getBookShelf()
    }
}
</script>

<style lang='scss' scoped>
@import 'assets/style/global';
.store-shelf{
    position: relative;
    z-index: 100;
    width:100%;
    height:100%;
    font-size: 0;
    .shelf-title {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 110;
    }
    .book-shelf-list {
      position: absolute;
      top: px2rem(93.5);
      left: 0;
      z-index: 100;
    }
    .book-shelf-empty {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 100;
    }
    .book-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      background: white;
    }
    .book-shelf-scroll-wrapper2 {
      position: absolute;
      top: px2rem(93.5);
      left: 0;
      z-index: 101;
    }
}
</style>