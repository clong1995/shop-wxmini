const prev = () => {
    let pages = getCurrentPages();
    return pages[pages.length - 2]
}

const getPage=(page)=>{
    let pages = getCurrentPages();
    return pages.find(v=>v.route === "pages/"+page+"/index");
}

module.exports = {
    prev,
    getPage
}
