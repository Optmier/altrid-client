webpackHotUpdate("main",{

/***/ "./src/components/TOFELEditor/TOFELEditor.js":
/*!***************************************************!*\
  !*** ./src/components/TOFELEditor/TOFELEditor.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/icons/Add */ "./node_modules/@material-ui/icons/Add.js");
/* harmony import */ var _material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_icons_SentimentDissatisfied__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/icons/SentimentDissatisfied */ "./node_modules/@material-ui/icons/SentimentDissatisfied.js");
/* harmony import */ var _material_ui_icons_SentimentDissatisfied__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_SentimentDissatisfied__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_quill__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-quill */ "./node_modules/react-quill/lib/index.js");
/* harmony import */ var react_quill__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_quill__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-quill/dist/quill.snow.css */ "./node_modules/react-quill/dist/quill.snow.css");
/* harmony import */ var react_quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _CreateNewProblem__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CreateNewProblem */ "./src/components/TOFELEditor/CreateNewProblem.js");
/* harmony import */ var _QuillEditorToolbarOption__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./QuillEditorToolbarOption */ "./src/components/TOFELEditor/QuillEditorToolbarOption.js");
/* harmony import */ var _ProblemCard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ProblemCard */ "./src/components/TOFELEditor/ProblemCard.js");
/* harmony import */ var _TOFELRenderer_SmartTOFELRender__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../TOFELRenderer/SmartTOFELRender */ "./src/components/TOFELRenderer/SmartTOFELRender.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _configs_configs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../configs/configs */ "./src/configs/configs.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @material-ui/lab */ "./node_modules/@material-ui/lab/esm/index.js");
/* harmony import */ var react_beforeunload__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-beforeunload */ "./node_modules/react-beforeunload/lib/index.esm.js");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @material-ui/icons */ "./node_modules/@material-ui/icons/esm/index.js");
var _jsxFileName = "/Users/choesein/Documents/Development/Eduity/Devs/eduity-lms/src/components/TOFELEditor/TOFELEditor.js";



















jquery__WEBPACK_IMPORTED_MODULE_5__["fn"].changeSize = function (handleFunction) {
  let element = this;
  let lastWidth = element.width();
  let lastHeight = element.height();
  setInterval(function () {
    if (lastWidth === element.width() && lastHeight === element.height()) return;

    if (typeof handleFunction == 'function') {
      handleFunction({
        width: element.width(),
        height: element.height()
      });
      lastWidth = element.width();
      lastHeight = element.height();
    }
  }, 50);
  return element;
};

const swapArray = (array, a, b) => {
  const tmp = array[a];
  array[a] = array[b];
  array[b] = tmp;
};

const fitEditorSize = height => {
  const rootHeight = height;
  const headerHeight = jquery__WEBPACK_IMPORTED_MODULE_5__('.tofel-editor-root > .header').height();
  const quillToolbarHeight = jquery__WEBPACK_IMPORTED_MODULE_5__('#new_tofel_passage').find('.ql-toolbar').height();
  const $quillContainer = jquery__WEBPACK_IMPORTED_MODULE_5__('#new_tofel_passage').find('.ql-container');
  const $problemContainer = jquery__WEBPACK_IMPORTED_MODULE_5__('.problem-container');
  $quillContainer.height(rootHeight - headerHeight - quillToolbarHeight - 36);
  $problemContainer.height(rootHeight - headerHeight - 70);
};

const EdAppBar = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["withStyles"])(theme => ({
  root: {
    backgroundColor: '#777777'
  }
}))(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["AppBar"]);
const EdToolbar = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["withStyles"])(theme => ({
  root: {
    paddingLeft: 0
  }
}))(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Toolbar"]);
const EdTextField = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["withStyles"])(theme => ({
  root: {
    '& .MuiInputBase-root': {
      color: '#ffffff',
      fontSize: '1.125rem',
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      }
    }
  }
}))(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["TextField"]);
const PreviewDialog = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["withStyles"])(theme => ({
  root: {
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-rounded': {
      maxWidth: 1280
    }
  }
}))(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Dialog"]);
const Root = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    /* padding: 16px; */
`;
const Header = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    width: 100%;
    position: relative;
`;
const Container = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    display: flex;
    /* padding-top: 16px; */
    width: 100%;
`;
const LeftContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    padding: 8px;
    width: 60%;
`;
const RightContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    border-left: 1px solid #adadad;
    padding: 8px;
    width: 40%;
`;
const AddButtonContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div``;
const ProblemsContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    overflow: auto;
    padding-top: 4px;
`;
const NoContentsProblemWarning = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    text-align: center;
    top: calc(50% + 32px);
    width: calc(40% - 16px);
    font-size: 1.25rem;
    font-weight: 600;
    color: #0000004d;
    user-select: none;

    & .MuiSvgIcon-root {
        font-size: 1.75rem;
        margin-right: 4px;
    }
`;
const PreviewContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    max-width: 1280px;
    max-height: 750px;
    width: 1280px;
    height: 750px;
`;
const BottomContainer = styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].div`
    display: flex;
    justify-content: flex-end;
    padding: 8px;

    & .group {
        & + .group {
            margin-left: 16px;
        }
    }
`;

function useForceUpdate() {
  let [value, setState] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(true);
  return () => setState(!value);
}

function TOFELEditor({
  id,
  datas,
  timeLimit,
  requestFile,
  mode,
  onChange,
  onClose,
  history,
  children,
  ...rest
}) {
  const quillRef = Object(react__WEBPACK_IMPORTED_MODULE_4__["useRef"])();
  const [metadata, setMetadata] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(datas);
  window.metadata = metadata;
  const [contentsSetData, setContentsSetData] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(datas[0]);
  const [contentsTitle, setContentsTitle] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(datas[0].title);
  const [contentsPassage, setContentsPassage] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])({
    render: datas[0].passageForRender,
    editor: datas[0].passageForEditor
  });
  const [contentsTimeLimit, setContentsTimeLimit] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(timeLimit);
  const [contentsProblemDatas, setContentsProblemDatas] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(datas[0].problemDatas);
  const [currentProblemData, setCurrentProblemData] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(undefined);
  const [problemEditmode, setProblemEditmode] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false);
  const [problemEditIdx, setProblemEditIdx] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0);
  const [openCreateNewDrawer, setOpenCreateNewDrawer] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false);
  const [openPreview, setOpenPreview] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false);
  const [alertBarOpen, setAlertBarOpen] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false);
  const [alertBarOption, setAlertBarOption] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])({
    message: '',
    severity: 'success'
  });
  const [setNum, setSetNum] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0);
  const [deleteMode, setDeleteMode] = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false);
  let forceUpdate = useForceUpdate();
  window.forceUpdate = forceUpdate;

  const handleAlertBarOpen = () => {
    setAlertBarOpen(true);
  };

  const handleAlertBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBarOpen(false);
  };

  const onTextFieldChange = ({
    target
  }) => {
    const {
      name,
      value
    } = target;

    switch (name) {
      case 'contents_title':
        setContentsTitle(value);
        break;

      case 'contents_time_limit':
        setContentsTimeLimit(value);

      default:
        break;
    }
  };

  const onQuillEditorChange = (content, delta, source, editor) => {
    setContentsPassage({
      render: content,
      editor: JSON.stringify(editor.getContents())
    });
  };

  const toggleDrawer = open => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpenCreateNewDrawer(open);
  };

  const handlePreviewOpen = () => {
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  const handleProblemCreate = event => {
    setCurrentProblemData(undefined);
    setProblemEditmode(false);
    toggleDrawer(true)(event);
  };

  const handleSwapProblemPosition = (a, b) => {
    let arr = contentsProblemDatas.slice();
    swapArray(arr, a, b);
    setContentsProblemDatas(arr);
  };

  window.testChangePosition = handleSwapProblemPosition;

  const onProblemCreate = newData => {
    // console.log(newData);
    if (problemEditmode) setContentsProblemDatas(contentsProblemDatas.map((origData, idx) => idx === problemEditIdx ? newData : origData));else setContentsProblemDatas([...contentsProblemDatas, newData]);
  };

  const onProblemEdit = editIdx => event => {
    setProblemEditmode(true);
    setCurrentProblemData(contentsProblemDatas[editIdx]);
    setProblemEditIdx(editIdx);
    toggleDrawer(true)(event);
  };

  const onProblemDelete = delIdx => event => {
    const confirmDialog = window.confirm('정말로 삭제하시겠어요?');
    if (confirmDialog) setContentsProblemDatas(contentsProblemDatas.filter((origData, idx) => idx !== delIdx));
  };

  const handleSaveContents = () => {
    if (id) axios__WEBPACK_IMPORTED_MODULE_12___default.a.patch(`${_configs_configs__WEBPACK_IMPORTED_MODULE_13__["apiUrl"]}/assignment-admin/${id}`, {
      contentsData: JSON.stringify(metadata)
    }, {
      withCredentials: true
    }).then(res => {
      setAlertBarOption({
        message: '저장되었습니다.',
        severity: 'success'
      });
      handleAlertBarOpen();
    }).catch(err => {
      setAlertBarOption({
        message: '저장에 실패했습니다.',
        severity: 'error'
      });
      handleAlertBarOpen();
      console.error(err);
    });
  };

  const handleDeleteContents = () => {
    const conf = window.confirm('정말로 삭제하시겠습니까?\n삭제 후에는 복구가 불가합니다.');
    if (!conf) return;
    if (id) axios__WEBPACK_IMPORTED_MODULE_12___default.a.delete(`${_configs_configs__WEBPACK_IMPORTED_MODULE_13__["apiUrl"]}/assignment-admin/${id}`, {
      withCredentials: true
    }).then(res => {
      setAlertBarOption({
        message: '삭제되었습니다.',
        severity: 'success'
      });
      handleAlertBarOpen();
      history.replace('/admins/contents-requests');
    }).catch(err => {
      setAlertBarOption({
        message: '삭제에 실패했습니다.',
        severity: 'error'
      });
      handleAlertBarOpen();
      console.error(err);
    });
  };

  const handlePrevSet = () => {
    if (setNum <= 0) return;
    setSetNum(setNum - 1);
  };

  const handleNextSet = () => {
    if (setNum >= metadata.length - 1) return;
    setSetNum(setNum + 1);
  };

  const addSet = () => {
    setMetadata([...metadata, {
      title: '',
      passageForRender: '',
      passageForEditor: `{"ops":[{"insert":"\n"}]}`,
      problemDatas: []
    }]);
    setSetNum(metadata.length);
  };

  const removeCurrentSet = () => {
    const conf = window.confirm('정말로 내용을 삭제하시겠습니까?');
    if (!conf) return;

    if (metadata.length < 2) {
      setContentsSetData({
        title: '',
        passageForRender: '',
        passageForEditor: `{"ops":[{"insert":"\n"}]}`,
        problemDatas: []
      });
      setContentsTitle('');
      setContentsPassage({
        render: '',
        editor: `{"ops":[{"insert":"\n"}]}`
      });
      setContentsProblemDatas([]);
      let s = `{"ops":[{"insert":"\n"}]}`.replace(/\\n/g, '\\n').replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, '\\&').replace(/\\r/g, '\\r').replace(/\\t/g, '\\t').replace(/\\b/g, '\\b').replace(/\\f/g, '\\f');
      s = s.replace(/[\u0000-\u0019]+/g, '');
      quillRef.current.editor.setContents(JSON.parse(s));
    }

    setMetadata(arr => {
      if (arr.length < 2) return arr;
      const f = arr.filter((d, i) => i !== setNum);
      console.log(f);

      if (setNum < 1) {
        setContentsSetData(f[0]);
        setContentsTitle(f[0].title);
        setContentsPassage({
          render: f[0].passageForRender,
          editor: f[0].passageForEditor
        });
        setContentsProblemDatas(f[0].problemDatas);

        if (f[0].passageForEditor) {
          let s = f[0].passageForEditor.replace(/\\n/g, '\\n').replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, '\\&').replace(/\\r/g, '\\r').replace(/\\t/g, '\\t').replace(/\\b/g, '\\b').replace(/\\f/g, '\\f');
          s = s.replace(/[\u0000-\u0019]+/g, '');
          quillRef.current.editor.setContents(JSON.parse(s));
        }
      } else {
        setSetNum(setNum - 1);
      }

      return f;
    });
    forceUpdate();
  };

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setContentsSetData({ ...contentsSetData,
      title: contentsTitle
    });
  }, [contentsTitle]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setContentsSetData({ ...contentsSetData,
      passageForRender: contentsPassage.render,
      passageForEditor: contentsPassage.editor
    });
  }, [contentsPassage]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setContentsSetData({ ...contentsSetData,
      problemDatas: contentsProblemDatas
    });
  }, [contentsProblemDatas]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setMetadata(metadata.map((d, i) => i === setNum ? contentsSetData : d));
  }, [contentsSetData]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    console.log('최종 컨텐츠 데이터:: ', metadata);
    onChange(metadata);
  }, [metadata]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setMetadata(datas);
    setContentsSetData(datas[0]);
    setContentsTitle(datas[0].title);
    setContentsPassage({
      render: datas[0].passageForRender,
      editor: datas[0].passageForEditor
    });
    setContentsProblemDatas(datas[0].problemDatas);

    if (datas[0].passageForEditor) {
      let s = datas[0].passageForEditor.replace(/\\n/g, '\\n').replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, '\\&').replace(/\\r/g, '\\r').replace(/\\t/g, '\\t').replace(/\\b/g, '\\b').replace(/\\f/g, '\\f');
      s = s.replace(/[\u0000-\u0019]+/g, '');
      quillRef.current.editor.setContents(JSON.parse(s));
    }
  }, [datas]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setContentsTimeLimit(timeLimit);
  }, [timeLimit]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    setContentsSetData(metadata[setNum]);
    setContentsTitle(metadata[setNum].title);
    setContentsPassage({
      render: metadata[setNum].passageForRender,
      editor: metadata[setNum].passageForEditor
    });
    setContentsProblemDatas(metadata[setNum].problemDatas);

    if (metadata[setNum].passageForEditor) {
      let s = metadata[setNum].passageForEditor.replace(/\\n/g, '\\n').replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, '\\&').replace(/\\r/g, '\\r').replace(/\\t/g, '\\t').replace(/\\b/g, '\\b').replace(/\\f/g, '\\f');
      s = s.replace(/[\u0000-\u0019]+/g, '');
      quillRef.current.editor.setContents(JSON.parse(s));
    }
  }, [setNum]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(() => {
    const $root = jquery__WEBPACK_IMPORTED_MODULE_5__('.tofel-editor-root');
    $root.parent().changeSize(({
      height
    }) => {
      fitEditorSize(height);
    });
    fitEditorSize($root.parent().height());
    jquery__WEBPACK_IMPORTED_MODULE_5__(window).unbind('keydown');
    jquery__WEBPACK_IMPORTED_MODULE_5__(window).bind('keydown', e => {
      if (e.keyCode === 80 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setOpenCreateNewDrawer(true);
      } else if (e.keyCode === 66 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setOpenPreview(!openPreview);
      } else if (e.keyCode === 49 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault(); // addPassageSplitter();
      } else if (e.keyCode === 50 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault(); // addParagraphSplitter();
      }
    });
  }, []);
  Object(react_beforeunload__WEBPACK_IMPORTED_MODULE_16__["useBeforeunload"])(e => e.preventDefault());
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(Root, {
    className: "tofel-editor-root",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 475,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Snackbar"], {
    open: alertBarOpen,
    autoHideDuration: 5000,
    onClose: handleAlertBarClose,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 476,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_lab__WEBPACK_IMPORTED_MODULE_15__["Alert"], {
    onClose: handleAlertBarClose,
    severity: alertBarOption.severity,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 477,
      columnNumber: 17
    }
  }, alertBarOption.message)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(PreviewDialog, {
    open: openPreview,
    onClose: handlePreviewClose,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 481,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(PreviewContainer, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 482,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_TOFELRenderer_SmartTOFELRender__WEBPACK_IMPORTED_MODULE_11__["default"], {
    preview: true,
    title: contentsTitle,
    passageForRender: contentsPassage.render,
    problemDatas: contentsProblemDatas,
    timer: contentsTimeLimit,
    onEnd: handlePreviewClose,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 483,
      columnNumber: 21
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Drawer"], {
    anchor: "right",
    open: openCreateNewDrawer,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 493,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_CreateNewProblem__WEBPACK_IMPORTED_MODULE_8__["default"], {
    problemDatas: currentProblemData,
    editmode: problemEditmode,
    handleClose: toggleDrawer(false),
    onCreate: onProblemCreate,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 494,
      columnNumber: 17
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(Header, {
    className: "header",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 501,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(EdAppBar, {
    position: "static",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 502,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(EdToolbar, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 503,
      columnNumber: 21
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(EdTextField, {
    variant: "outlined",
    fullWidth: true,
    placeholder: "\uCEE8\uD150\uCE20 \uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694.",
    name: "contents_title",
    value: contentsTitle,
    onChange: onTextFieldChange,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 504,
      columnNumber: 25
    }
  }), requestFile ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    href: `${_configs_configs__WEBPACK_IMPORTED_MODULE_13__["apiUrl"]}/files/${requestFile}`,
    download: requestFile.substring(requestFile.indexOf('_') + 1).substring(requestFile.lastIndexOf('/') + 1),
    color: "inherit",
    style: {
      minWidth: 128
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 513,
      columnNumber: 29
    }
  }, "\uCCA8\uBD80\uD30C\uC77C(F)") : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    color: "inherit",
    onClick: handlePreviewOpen,
    style: {
      minWidth: 128
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 522,
      columnNumber: 25
    }
  }, "\uBBF8\uB9AC\uBCF4\uAE30(B)"), mode ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    color: "inherit",
    onClick: onClose,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 526,
      columnNumber: 29
    }
  }, "\uD655\uC778") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    color: "inherit",
    style: {
      minWidth: 72
    },
    onClick: handleSaveContents,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 531,
      columnNumber: 33
    }
  }, "\uC800\uC7A5(S)"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    color: "inherit",
    style: {
      minWidth: 72
    },
    onClick: handleDeleteContents,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 534,
      columnNumber: 33
    }
  }, "\uC0AD\uC81C(D)"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(Container, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 542,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(LeftContainer, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 543,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(react_quill__WEBPACK_IMPORTED_MODULE_3___default.a, {
    id: "new_tofel_passage",
    ref: quillRef,
    modules: {
      toolbar: _QuillEditorToolbarOption__WEBPACK_IMPORTED_MODULE_9__["default"]
    },
    placeholder: "\uC9C0\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694." // value={contentsPassage.editor}
    ,
    onChange: onQuillEditorChange,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 544,
      columnNumber: 21
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(RightContainer, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 553,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(AddButtonContainer, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 554,
      columnNumber: 21
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    variant: "outlined",
    fullWidth: true,
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_1___default.a, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 555,
        columnNumber: 73
      }
    }),
    onClick: handleProblemCreate,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 555,
      columnNumber: 25
    }
  }, "\uC0C8 \uBB38\uC81C \uCD94\uAC00(P)")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(ProblemsContainer, {
    className: "problem-container",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 559,
      columnNumber: 21
    }
  }, contentsProblemDatas.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, contentsProblemDatas.map((data, idx) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_ProblemCard__WEBPACK_IMPORTED_MODULE_10__["default"], {
    key: idx,
    category: data.category,
    type: data.type,
    textForRender: data.textForRender,
    selections: data.selections,
    answer: data.answer,
    score: data.score,
    handleEdit: onProblemEdit(idx),
    handleDelete: onProblemDelete(idx),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 563,
      columnNumber: 37
    }
  }))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(NoContentsProblemWarning, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 577,
      columnNumber: 29
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons_SentimentDissatisfied__WEBPACK_IMPORTED_MODULE_2___default.a, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 578,
      columnNumber: 33
    }
  }), "\uC544\uC9C1 \uCD94\uAC00\uD558\uC2E0 \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4!")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(BottomContainer, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 585,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
    className: "group",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 586,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_17__["ArrowBack"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 587,
        columnNumber: 40
      }
    }),
    onClick: handlePrevSet,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 587,
      columnNumber: 21
    }
  }, "\uC774\uC804 \uC138\uD2B8"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("span", {
    style: {
      margin: '0 8px'
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 590,
      columnNumber: 21
    }
  }, setNum + 1, " / ", metadata.length), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    endIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_17__["ArrowForward"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 593,
        columnNumber: 38
      }
    }),
    onClick: handleNextSet,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 593,
      columnNumber: 21
    }
  }, "\uB2E4\uC74C \uC138\uD2B8")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
    className: "group",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 597,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_17__["PostAdd"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 598,
        columnNumber: 40
      }
    }),
    onClick: addSet,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 598,
      columnNumber: 21
    }
  }, "\uC138\uD2B8 \uCD94\uAC00"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__["Button"], {
    color: "secondary",
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_17__["DeleteForever"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 601,
        columnNumber: 58
      }
    }),
    onClick: removeCurrentSet,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 601,
      columnNumber: 21
    }
  }, "\uC138\uD2B8 \uC0AD\uC81C"))));
}

TOFELEditor.defaultProps = {
  id: 0,
  datas: [{
    title: '',
    passageForRender: '',
    passageForEditor: `{"ops":[{"insert":"\n"}]}`,
    problemDatas: []
  }],
  timeLimit: 60,
  requestFile: undefined,
  mode: false,
  onChange: metadata => {},
  onClose: () => {}
};
/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_14__["withRouter"])(TOFELEditor));

/***/ })

})
//# sourceMappingURL=main.0938bebdc09b0a7615d8.hot-update.js.map