const store = {
    state:{
        hotSearchOffsetY:0,
        flapcardVisible:false,
        //isEditMode:false,//是否进入编辑模式
        shelfList:[],//书架的图书列表
        shelfSelected:[],//书架图书选中状态的列表
        shelfTitleVisible:true//书架书籍的显示状态
    },
    mutations:{
        SET_HOT_SEARCH_OFFSETY(state,offsetY){
            state.hotSearchOffsetY = offsetY
        },
        SET_FLAP_CARD_VISIBLE(state,visible){
            state.flapcardVisible = visible
        },
        // SET_IS_EDIT_MODE(state,isEditMode){
        //     state.isEditMode = isEditMode
        // },
        SET_SHELF_LIST(state,shelfList){
            state.shelfList = shelfList
        },
        SET_SHELF_SELECTED(state,shelfSelected){
            state.shelfSelected = shelfSelected
        },
        SET_SHELF_TITLE_VISIBLE(state,shelfTitleVisible){
            state.shelfTitleVisible = shelfTitleVisible
        }
    }
}

export default store