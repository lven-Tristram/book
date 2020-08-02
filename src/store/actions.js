const actions = {
    setFileName : ({commit},fileName)=>{
        return commit('SET_FILENAME',fileName)
    },
    setMenuVisible:({commit},menuVisible)=>{
        return commit('SET_MENU_VISIBLE',menuVisible)
    },
    setSettingVisible:({commit},settingVisible)=>{
        return commit('SET_SETTING_VISIBLE',settingVisible)
    },
    setDefaultFontSize:({commit},defaultFontSize)=>{
        return commit('SET_DEFAULT_FONTSIZE',defaultFontSize)
    },
    setCurrentBook: ({ commit }, currentBook) => {
        return commit('SET_CURRENT_BOOK', currentBook)
    },
    setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
    },
    setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
        return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    setIsPaginating: ({ commit }, isPaginating) => {
        return commit('SET_IS_PAGINATING', isPaginating)
    },
    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    setPaginate: ({ commit }, paginate) => {
        return commit('SET_PAGINATE', paginate)
    },
    setPagelist: ({ commit }, pagelist) => {
        return commit('SET_PAGELIST', pagelist)
    },
    setIsBookmark({ commit }, isBookmark) {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setOffsetY({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
    },
    setSpeakingIconBottom({ commit }, speakingIconBottom) {
        commit('SET_SPEAKING_ICON_BOTTOM', speakingIconBottom)
    },
    setDefaultTheme: ({ commit }, defaultTheme) => {
        return commit('SET_DEFAULT_THEME', defaultTheme)
    },
    setHotSearchOffsetY({commit},offsetY){
        return commit('SET_HOT_SEARCH_OFFSETY',offsetY)
    },
    setFlapCardVisible({commit},visible){
        return commit('SET_FLAP_CARD_VISIBLE',visible)
    },
    // setIsEditMode({commit},isEditMode){
    //     return commit('SET_IS_EDIT_MODE',isEditMode)
    // },
    setShelfList({commit},shelfList){
        return commit('SET_SHELF_LIST',shelfList)
    },
    setShelfSelected({commit},shelfSelected){
        return commit('SET_SHELF_SELECTED',shelfSelected)
    },
    setShelfTitleVisible({commit},shelfTitleVisible){
        return commit('SET_SHELF_TITLE_VISIBLE',shelfTitleVisible)
    },
}
export default actions