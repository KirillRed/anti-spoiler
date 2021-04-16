try {
    var keywords = ['itpedia', 'mandalorian', 'rebels', 'ahsoka', 'ezra', 'sabine', 'kanan',
        'avatar', 'aang', 'sokka', 'katara', 'yoda', 'english'];
    var exceptionKeywords = ['practise']
}
catch (ReferenceError) {

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    setInterval(indexBlock, 1000)
    sendResponse('Got it')
});

setInterval(indexBlock, 1000)


function indexBlock() {
    let videos = document.getElementsByTagName('ytd-rich-item-renderer')
    for (let video of videos) {
        if (video.getElementsByTagName('h3').length === 0) {
            continue
        }
        let title;
        title = video.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].getAttribute('aria-label')
        if (title === null) { //If video is mix
            title = video.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].getAttribute('title')
        }
        //If title still null
        if (title === null) {
            continue
        }
        let blockedKeywords = []

        for (let keyword of keywords) {
            if (title.toLowerCase().includes(keyword) && !exceptionKeywords.some(word => title.toLowerCase().includes(word))) {
                blockedKeywords.push(keyword)

            }
        }
        if (video.getElementsByClassName('div-blocked').length === 0 && blockedKeywords.length > 0) {
            let contentDiv = video.getElementsByTagName('div')[0]
            video.classList.add('blocked')
            contentDiv.setAttribute('hidden', 'true')
            let blockedKeywordsString = ''
            if (blockedKeywords.length === 1) {
                blockedKeywordsString = 'this keyword: ' + blockedKeywords[0]
            }
            else {
                blockedKeywordsString = 'these keywords: ' + blockedKeywords.join(', ')
            }
            video.insertAdjacentHTML('beforeend', `<div class="div-blocked">Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a>HERE</a></div>`)

            video.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
                contentDiv.removeAttribute('hidden')
                video.classList.remove('blocked')
                video.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true')
            })


        }
    }
}
