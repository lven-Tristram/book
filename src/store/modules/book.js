const book = {
    state:{
        fileName:'',
        menuVisible:false,
        settingVisible:-1, //-1表示不显示;0:字号,1:主题,3:目录
        defaultFontSize:16,
        currentBook:null,
        defaultFontFamily: 'Default',
        fontFamilyVisible: false,
        defaultTheme: 'Default',
        bookAvailable: false,
        progress: 0,
        section: 0,//表示章节序号
        isPaginating: true,
        navigation: null,
        cover: null,
        metadata: null,
        paginate: '',
        pagelist: null,
        offsetY: 0,//下拉标签
        isBookmark: null,//当前页是否为书签页
        // speakingIconBottom: realPx(58)
    },
    mutations:{
        'SET_FILENAME' : (state,fileName)=>{
            state.fileName = fileName
        },
        'SET_MENU_VISIBLE' : (state,menuVisible)=>{
            state.menuVisible = menuVisible
        },
        'SET_SETTING_VISIBLE' : (state,settingVisible)=>{
            state.settingVisible = settingVisible
        },
        'SET_DEFAULT_FONTSIZE' : (state,defaultFontSize)=>{
            state.defaultFontSize = defaultFontSize
        },
        'SET_CURRENT_BOOK' : (state, currentBook) => {
            state.currentBook = currentBook
        },
        'SET_DEFAULT_FONT_FAMILY': (state, defaultFontFamily) => {
            state.defaultFontFamily = defaultFontFamily
          },
          'SET_FONT_FAMILY_VISIBLE': (state, fontFamilyVisible) => {
            state.fontFamilyVisible = fontFamilyVisible
          },
          'SET_DEFAULT_THEME': (state, defaultTheme) => {
            state.defaultTheme = defaultTheme
          },
          'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
            state.bookAvailable = bookAvailable
          },
          'SET_PROGRESS': (state, progress) => {
            state.progress = progress
          },
          'SET_SECTION': (state, section) => {
            state.section = section
          },
          'SET_IS_PAGINATING': (state, isPaginating) => {
            state.isPaginating = isPaginating
          },
          'SET_NAVIGATION': (state, navigation) => {
            state.navigation = navigation
          },
          'SET_COVER': (state, cover) => {
            state.cover = cover
          },
          'SET_METADATA': (state, metadata) => {
            state.metadata = metadata
          },
          'SET_PAGINATE': (state, paginate) => {
            state.paginate = paginate
          },
          'SET_PAGELIST': (state, pagelist) => {
            state.pagelist = pagelist
          },
          'SET_OFFSETY': (state, offsetY) => {
            state.offsetY = offsetY
          },
          'SET_IS_BOOKMARK': (state, isBookmark) => {
            state.isBookmark = isBookmark
          },
          'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
            state.speakingIconBottom = speakingIconBottom
          }
    },

}
export default book